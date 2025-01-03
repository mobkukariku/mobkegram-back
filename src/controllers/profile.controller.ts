import { Request, Response } from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "../models/user.model";
import {uploadAvatarService} from "../services/profile.service";


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
        const user = await User.findById(userId).select("-password");
        if(!user){
            res.status(404).json({message: "User not found"});
            return
        }
        res.status(200).json({user});
    }catch (err){}
}
