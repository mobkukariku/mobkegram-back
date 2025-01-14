import express from "express";
import {uploadAvatarMiddleware} from "../middlewares/multer.middleware";
import {uploadAvatar, getProfile, updateProfile, updatePassword, changeUsername} from "../controllers/profile.controller";
import {AuthMiddleware} from "../middlewares/auth.middleware";


const router = express.Router();

router.post('/change-avatar',AuthMiddleware, uploadAvatarMiddleware, uploadAvatar);
router.get('/', AuthMiddleware, getProfile);
router.patch('/', AuthMiddleware, updateProfile);
router.post('/change-password', AuthMiddleware, updatePassword);
router.post('/change-username', AuthMiddleware, changeUsername);

export default router;
