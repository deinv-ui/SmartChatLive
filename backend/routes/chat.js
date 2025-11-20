import express from "express";
import { getChatHistory } from "../controllers/chatController";

const router = express.Router();

router.get("/messages", getChatHistory);

export default router;