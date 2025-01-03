import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {deleteFriend, getFriends,} from "../controllers/friends.controller";

const router  = express.Router();


router.get("/", AuthMiddleware, getFriends);
router.delete("/", AuthMiddleware, deleteFriend);

export default router;
