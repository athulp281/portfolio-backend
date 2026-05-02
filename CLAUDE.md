# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server with `nodemon` and auto-load `.env` via `dotenv/config`. Use this for local development.
- `npm start` — run the server once via `node server.js`. Note: this entrypoint does NOT auto-load `.env`; the `dev` script does. If running `start` directly, ensure env vars are exported by the shell.
- No test runner is configured (`npm test` is a placeholder that exits 1).

The server listens on port `5000` (hardcoded in `server.js`). CORS is hardcoded to allow `http://localhost:3000` (the Vite frontend) — update `app.js` when the frontend origin changes.

## Required environment variables

- `OPENAI_API_KEY` — used by `src/config/openai.js` to talk to OpenAI (chat completions, model `gpt-4o-mini`).
- `API_KEY` — shared secret that every `/api/*` route requires via the `x-api-key` header (`src/middlewares/validateApiKey.js`).

## Architecture

This is an ES-module Express 5 backend (`"type": "module"`) that serves a personal portfolio chat assistant ("Athion AI"). The notable piece is a **fully in-process RAG pipeline** — there is no vector DB, no external embedding API.

### Request lifecycle

`server.js` → `initRAG()` (blocks startup until embeddings are computed) → `app.listen` → `app.js` mounts routes at `/api` → `src/routes/index.js` fans out to `chat.routes.js` and `profile.routes.js`. Every route is wrapped in `limiter` (30 req / 15 min per IP) and `validateApiKey` before reaching the controller.

Controllers are thin and always respond via `sendResponse(res, statusCode, status, message, data, meta)` from `src/utils/response.js`, which produces the canonical envelope `{ status, message, data, meta }` defined in `response.model.js`. Status codes come from the `statusCodes` registry in `src/registry/status-code.registry.js` — use the registry rather than raw numbers.

### RAG pipeline (the load-bearing part)

1. **Boot-time embedding** (`src/services/rag.service.js#initRAG`): on startup, every entry in `src/data/portfolio.json` is embedded once and cached in the module-level `embeddedData` array. This means startup is slow on the first run (the transformer model downloads), and the cache is process-local — restart re-embeds everything.
2. **Embeddings** (`src/services/embedding.service.js`): uses `@xenova/transformers` running locally with the `Xenova/all-MiniLM-L6-v2` model. The `extractor` pipeline is lazy-loaded and reused. Embeddings are mean-pooled and L2-normalized.
3. **Retrieval** (`ragSearch`): cosine similarity (`src/utils/cosineSimilarity.js`) against the in-memory cache, returns the top 5 hits.
4. **Generation** (`src/services/chat.service.js`): the top-5 contents are concatenated into the user message as `Context: ... \n\nQuestion: ...` and sent to `gpt-4o-mini`. The system prompt enforces a strict persona ("Athion AI", first person, defined fallback for out-of-portfolio questions, technical questions are allowed to draw on general knowledge). When changing the prompt, preserve those rules unless explicitly asked to.

### Data sources

- `src/data/portfolio.json` — the RAG knowledge base. Each entry is `{ id, content }` and `content` is the literal text that gets embedded. Adding entries requires a server restart to re-run `initRAG`.
- `src/data/PersonalData.js` — flat structured data served verbatim by the `/profile` routes; not part of RAG.

### Conventions

- ES modules with explicit `.js` extensions on all relative imports — required because `package.json` sets `"type": "module"`.
- All controller responses go through `sendResponse`. Don't call `res.json` directly; it breaks the envelope contract that the frontend expects.
- New protected routes must compose `limiter` and `validateApiKey` in that order, matching the existing routes.
- `src/middlewares/error.middleware.js` exists but is not currently mounted in `app.js`; controllers handle their own try/catch and call `next(err)`. If wiring it in, mount it after the routes.
