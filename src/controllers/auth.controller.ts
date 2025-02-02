import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils";

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({  name, username, email, password: hashedPassword, pictureURL: "https://cdn4.iconfinder.com/data/icons/eldorado-user/40/user-1024.png" });
    await user.save();

    const token = generateToken(String(user._id), res);

    res.status(201).json({ message: "User created", user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Password is incorrect" });
      return;
    }

    const token = generateToken(String(user._id), res);
    res.status(200).json({ message: "Login successful", user, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}


export const LogOut = async(req:Request, res:Response) => {
  res.clearCookie("jwt");
  res.status(200).json({message: "Logout successful"})
}
