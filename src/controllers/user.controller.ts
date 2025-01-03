import { Request, Response } from "express";
import User from "../models/user.model";
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
        
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const deleteUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};


