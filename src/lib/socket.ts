import * as http from "node:http";
import express from "express";
import {Server} from "socket.io";

const app = express();

const server = http.createServer(app);

const io =  new Server(server,{
    cors: {
        origin: "*",
    },
});

const userSocketMap: Record<string, string> = {};

export function getReceiverSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId as string | undefined;

    if(userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);

    })
})

export {server, io, app};