import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {getMessages, sendMessage, } from "../controllers/message.controller";

const router = express.Router();

router.get('/:id', AuthMiddleware, getMessages);
router.post('/send/:id', AuthMiddleware, sendMessage);

export default router;

