import { Request, Response } from "express";
import prisma from "../config/supabase";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterBody {
  name?: string;
  email: string;
  password: string;
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    // Validation name :
    if (typeof name !== "string")
      return res.status(400).json({
        error: "Name need to be a string",
      });

    // Validation password :

    if (!password || typeof password !== "string")
      return res.status(400).json({
        error: "Password is required",
      });

    if (password.length < 6)
      return res.status(400).json({
        error: "Password must be at least 6 characters ",
      });
    // Validation email:

    if (!email || typeof email !== "string")
      return res.status(400).json({
        error: "Email is required",
      });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(409).json({ error: "Email is already used" });

    // Hashing password :

    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user :

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      message: "User successfully created",
      user,
    });
  } catch (error: any) {
    console.error("[REGISTER] Error:", {
      error: error.message,
      code: error.code,
    });

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// LOGIN :

interface LoginBody {
  password: string;
  email: string;
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { password, email } = req.body;

    // Validation Email and Password :

    if (!password || !email)
      return res.status(400).json({ error: "Email and password are required" });

    // Validation email exists :

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Validation password :

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    // Creating token :

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    // Return token with user :

    res.status(200).json({
      message: `Hello ${user.name} you are successfully logged in !`,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAT: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[LOGIN] Error:", {
      error: error.message,
      code: error.code,
    });
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
