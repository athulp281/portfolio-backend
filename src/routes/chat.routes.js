import express from "express";
import { askQuestion } from "../controllers/chat.controller.js";
import { limiter } from "../middlewares/rateLimit.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";

const router = express.Router();

router.post("/ask", limiter, validateApiKey, askQuestion);

export default router;
