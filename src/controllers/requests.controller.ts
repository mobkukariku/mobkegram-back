import {Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import User from "../models/user.model";

export const getAllSentRequests = async (req:Request, res:Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;

        const user = await User.findById(userId).populate(
            "sentRequests",
            "username email pictureUrl name");
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json({requests: user.sentRequests})

    }catch(err){
        res.status(500).json({message: "Something went wrong"});
    }
}
export const getAllReceivedRequests = async (req:Request, res:Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;

        const user = await User.findById(userId).populate(
            "friendRequests",
            "username email pictureUrl name");
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json({requests: user.friendRequests})

    }catch(err){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const sentAddFriend = async (req: Request, res: Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;

        const {targetUsername} = req.body;

        const user = await User.findById(userId);
        const targetUser = await User.findOne({username: targetUsername});
        if (!user || !targetUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if(user.friends.includes(targetUser.id)){
            res.status(400).json({ message: "User already added" });
            return;
        }

        user.sentRequests.push(targetUser.id);
        targetUser.friendRequests.push(userId);

        await user.save();
        await targetUser.save();
        res.status(200).json({ message: "Friend request sent" });
    }catch (err){
        res.status(500).json({ message: "Error sending friend request", err });
    }
}

export const acceptFriend = async (req: Request, res: Response) => {
    try {
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const {requestUsername, accept } = req.body;

        const user = await User.findById(userId);
        const requester = await User.findOne({ username: requestUsername });

        if (!user || !requester) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.friends.includes(requester.id)) {
            res.status(400).json({ message: "User already added as a friend" });
            return;
        }

        if (!user.friendRequests.includes(requester.id)) {
            res.status(400).json({ message: "No friend request from this user" });
            return;
        }

        user.friendRequests = user.friendRequests.filter(id => id.toString() !== requester.id);
        requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== userId);

        if (accept) {
            user.friends.push(requester.id);
            requester.friends.push(userId);
        }

        await user.save();
        await requester.save();

        res.status(200).json({
            message: accept ? "Friend request accepted" : "Friend request rejected",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error responding to friend request",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
