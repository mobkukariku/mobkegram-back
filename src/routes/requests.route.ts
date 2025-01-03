import express from "express";
import {AuthMiddleware} from "../middlewares/auth.middleware";
import {
    acceptFriend,
    getAllReceivedRequests,
    getAllSentRequests,
    sentAddFriend
} from "../controllers/requests.controller";;

const router = express.Router();

router.get("/getSentRequests", AuthMiddleware, getAllSentRequests);
router.get("/getReceivedRequests", AuthMiddleware, getAllReceivedRequests);
router.post("/send-friend-request/", AuthMiddleware, sentAddFriend);
router.post("/accept-friend-request/", AuthMiddleware, acceptFriend);


export default router;

