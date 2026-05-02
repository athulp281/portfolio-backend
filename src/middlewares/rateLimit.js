import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30, // 30 requests per IP
  message: "Too many requests, please try again later.",
});
