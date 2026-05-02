import express from "express";
import chatRoutes from "./chat.routes.js";
import profileRoutes from "./profile.routes.js";

const router = express.Router();

router.use("/chat", chatRoutes);
router.use("/profile", profileRoutes);

export default router;
