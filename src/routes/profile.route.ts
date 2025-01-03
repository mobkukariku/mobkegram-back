import express from "express";
import {uploadAvatarMiddleware} from "../middlewares/multer.middleware";
import {uploadAvatar} from "../controllers/profile.controller";


const router = express.Router();

router.post('/change-avatar',uploadAvatarMiddleware, uploadAvatar);

export default router;
