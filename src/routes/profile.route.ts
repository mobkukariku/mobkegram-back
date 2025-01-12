import express from "express";
import {uploadAvatarMiddleware} from "../middlewares/multer.middleware";
import {uploadAvatar, getProfile, updateProfile, updatePassword} from "../controllers/profile.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";


const router = express.Router();

router.post('/change-avatar',AuthMiddleware, uploadAvatarMiddleware, uploadAvatar);
router.get('/', AuthMiddleware, getProfile);
router.patch('/', AuthMiddleware, updateProfile);
router.post('/change-password', AuthMiddleware, updatePassword);

export default router;
