import mongoose from "mongoose";
export interface User {
    username: string;
    pictureURL: string;
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
    sentRequests: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>({
        username: {
            type: String,
            required: true
        },
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        pictureURL: {
            type: String,
            default: ""
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        friends: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        friendRequests: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
        sentRequests: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }],
    },
    { timestamps: true },
);

const User = mongoose.model<User>("User", userSchema);


export default User;