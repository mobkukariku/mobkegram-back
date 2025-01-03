import express from "express";
import { connectDB } from "./lib/db";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/users.route";
import friendsRoute from "./routes/friends.route";
import requestsRoute from "./routes/requests.route";
import profileRoute from "./routes/profile.route";

dotenv.config();
const app = express();

const port = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/friends", friendsRoute);
app.use("/api/requests", requestsRoute);
app.use("/api/profile", profileRoute);

app.listen(port, async () => {
  await connectDB(); 
  console.log(`Server is running on port ${port}`);
});
