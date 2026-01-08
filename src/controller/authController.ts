// IMPORTS :

import prisma from "../config/supabase";
import { Request, Response } from "express";
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
    const { password, name, email } = req.body;

    // Validation name :
    if (!name || typeof name !== "string")
      return res.status(400).json({
        error: "Name is required",
      });
    // Validation email :
    if (!email || typeof email !== "string")
      return res.status(400).json({
        error: "Email is required",
      });
    // Validation password :

    if (!password || typeof password !== "string")
      return res.status(400).json({ error: "Email is required" });

    if (password.length < 6)
      return res.status(400).json({
        error: "Paaword must be at least 6 characters",
      });

    // Verify email not used :

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(409).json({
        error: "Email already used",
      });

    // Hashing password:

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in db :

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
      select: {
        id: true,
        updatedAt: true,
        email: true,
        name: true,
      },
    });

    res.status(201).json({
      message: "User successfully created",
      user,
    });
  } catch (error: any) {
    console.error("[REGISTER] Error: ", {
      error: error.message,
      code: error.code,
    });

    res.status(500).json({
      error: "Internal server error ",
    });
  }
};

// Login:

interface LoginBody {
  name?: string;
  email: string;
  password: string;
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation password & email :

    if (!email || !password)
      return res.status(400).json({
        error: "Email and password are required",
      });

    // Validation user :

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return res.status(401).json({ error: "Invalide credentials" });

    // Validation password :
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(401).json({
        error: "Invalid credentials",
      });

    // Creating Token :

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.name },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Successfully logged in",
      token,
      user: {
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("[LOGIN] Error:", {
      error: error.message,
      code: error.code,
    });
  }
};
