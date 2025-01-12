import {Request, Response} from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";


export const getFriends = async (req: Request, res: Response) => {
    try{
        const {userId:id} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const user = await User.findById(id).populate("friends", "username email pictureURL name");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ friends: user.friends });
    }catch (err){
        res.status(500).json({ message: "Error getting friends", err });
    }
}


export const deleteFriend = async (req: Request, res: Response) => {
    try{
        const {userId} = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET!) as JwtPayload;
        const {friendUsername} = req.body;

        const user = await User.findById(userId);
        const friend = await User.findOne({username: friendUsername});

        if(!user || !friend){
            res.status(404).json({ message: "User not found" });
            return;
        }

        if(!user.friends.includes(friend.id)){
            res.status(400).json({ message: "User not a friend" });
            return;
        }

        await User.updateOne(
            { _id: userId },
            { $pull: { friends: friend.id } }
        );
        await User.updateOne(
            { _id: friend.id },
            { $pull: { friends: userId } }
        );

        res.status(200).json({ message: "Friend removed successfully" });

    }catch (err){
        res.status(500).json({ message: "Error deleting friend", err });
    }
}
