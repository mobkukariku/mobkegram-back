import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {getMessages, sendMessage, getMessageForSideBar} from "../controllers/message.controller";

const router = express.Router();

router.get('/users', AuthMiddleware, getMessageForSideBar);
router.get('/:id', AuthMiddleware, getMessages);
router.post('/send/:id', AuthMiddleware, sendMessage);

export default router;

