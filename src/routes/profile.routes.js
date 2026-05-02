import express from "express";
import { limiter } from "../middlewares/rateLimit.js";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import {
  getPersonalData,
  getSocialData,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/get-personal-details", limiter, validateApiKey, getPersonalData);
router.get("/get-social-details", limiter, validateApiKey, getSocialData);

export default router;
