import express from "express";
import { Login, LogOut, SignUp } from "../controllers/auth.controller";

const router = express.Router();
router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", LogOut)

export default router;