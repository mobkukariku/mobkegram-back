import mongoose from "mongoose";
export interface Message {
    _id: string;
    senderID: string;
    receiverID: string;
    content: string;
    timestamp: number;
}

const messageSchema = new mongoose.Schema<Message>({
    senderID: { type: String, ref: "User", required: true },
    receiverID: { type: String, ref: "User", required: true },
    content: { type: String, required: true },
},
    { timestamps: true }
)

const Message = mongoose.model<Message>("Message", messageSchema);

export default Message;
