import express from "express";
import cors from "cors"; // ✅ add this
import routes from "./src/routes/index.js";

const app = express();

// ✅ allow frontend requests
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL (Vite default)
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", routes);

export default app;
