import { Request, Response } from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "../models/user.model";
import {uploadAvatarService} from "../services/profile.service";
import bcrypt from "bcrypt";


export const uploadAvatar = async (req: Request, res: Response)=> {
    try{
        if(!req.file){
            res.status(400).json({message: "No file uploaded"});
            return;
        }
        const { userId } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({message: "User not found"});
            return
        }
        const fileUrl = await uploadAvatarService(req.file as Express.MulterS3.File);

        user.pictureURL = fileUrl;
        user.save();
        res.status(200).json({ url: fileUrl });
    }catch (err){
        res.status(500).json({ message: 'Failed to upload avatar', err });
    }
}

export const getProfile = async (req: Request, res: Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findById(userId).select("-password  -createdAt -updatedAt -role");
        if(!user){
            res.status(404).json({message: "User not found"});
            return
        }
        res.status(200).json({user});
    }catch (err){}
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findByIdAndUpdate(userId, req.body, {new: true});
        if(!user){
            res.status(404).json({message: "User not found"});
            return
        }
        res.status(200).json({user});
    }catch (err){
        res.status(500).json({message: "Failed to update profile", err});
    }
}

export const changeUsername = async (req: Request, res: Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const {username} = req.body;
        if(!username){
            res.status(500).json({message: "Username doesn't exist"});
        }
        const user = await User.findById(userId);
        const anotherUser = await User.findOne({username});
        if(anotherUser){
            res.status(401).json({message: "Username already exist"});
        }
        if(!user){
            res.status(404).json({message: "User not found"});
            return
        }
        user.username = username;

        user.save();
        res.status(200).json({user});
    }catch (err){
        res.status(500).json({message: "Failed to update profile", err});
    }
}

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const {oldPassword, newPassword} = req.body;
        const user = await User.findById(userId);

        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }

        if(!bcrypt.compareSync(oldPassword, user.password.toString())){
            res.status(400).json({message: "Old password is incorrect"});
            return;
        }
        user.password = bcrypt.hashSync(newPassword, 10);
        user.save();
        res.status(200).json({message: "Password updated successfully"});
    }catch (err){
        res.status(500).json({message: "Failed to update profile", err});
    }
}