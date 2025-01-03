import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import jwt, { JwtPayload } from "jsonwebtoken";


export const getMessages = async (req: Request, res: Response) => {
    try{
        const {id:userId} = req.params;
        const token = req.cookies.jwt;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const myId = decodedUser.userId;
        const messages = await Message.find({$or:[{from:userId, to:myId},{from:myId, to:userId}]});
        res.status(200).json(messages);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "An error occurred",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}

export const sendMessage = async (req: Request, res: Response) => {
    try{
        const {id:userId} = req.params;
        const {message} = req.body;
        const token = req.cookies.jwt;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const myId = decodedUser.userId;
        const newMessage = new Message({from:myId, to:userId, message});
        await newMessage.save();
        res.status(200).json({message: "Message sent"});
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "An error occurred",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}