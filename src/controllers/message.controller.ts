import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import {getReceiverSocketId, io} from "../lib/socket";


export const getMessages = async (req: Request, res: Response) => {
    try{
        const {id:userId} = req.params;
        const token = req.cookies.jwt;
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const myId = decodedUser.userId;
        const messages = await Message.find({
            $or: [
                { senderID: myId, receiverID: userId },
                { receiverID: myId, senderID: userId }
            ]
        }).sort({ createdAt: 1 });

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
        const newMessage = new Message({
            senderID:myId,
            receiverID: userId,
            content: message,
        });
        await newMessage.save();
        const receiverSocketID = getReceiverSocketId(userId);
        if(receiverSocketID){
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }
        res.status(201).json({message: newMessage});
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "An error occurred",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
}

