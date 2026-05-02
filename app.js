import express from "express";
import cors from "cors";
import routes from "./src/routes/index.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // if using Vite
  "https://portfolio-backend-3zz7.onrender.com", // 👈 replace with your real URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api", routes);

export default app;
