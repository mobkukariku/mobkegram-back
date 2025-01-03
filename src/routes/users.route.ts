import express from "express";
import { getUsers, getUserById, updateUser, deleteUserById } from "../controllers/user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { RoleMiddleware } from "../middlewares/role.middleware";

const router = express.Router();

router.get("/", AuthMiddleware, RoleMiddleware("admin"), getUsers); 

router.get("/:id", AuthMiddleware, RoleMiddleware("admin"), getUserById);

router.patch("/:id", AuthMiddleware, RoleMiddleware("admin"), updateUser);

router.delete("/:id", AuthMiddleware, RoleMiddleware("admin"), deleteUserById);

export default router