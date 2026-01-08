// REGISTER :
import prisma from "../config/supabase";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register :

interface RegisterBody {
  name?: String;
  email: String;
  password: String;
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { email, password, name } = req.body;

    // validation name :
    if (!name || typeof name !== "string")
      return res.status(400).json({ error: "Name is required" });

    // Validation email :

    if (!email || typeof email !== "string")
      return res.status(400).json({ error: "Email is required" });

    // Validation password :

    if (!password || typeof password !== "string")
      return res.status(400).json({ error: "Password is required" });

    if (password.length < 7)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });

    // User exists :

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.status(409).json({ error: "Email already used" });

    // hashPassword :
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user :

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
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

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // 2. Trouver user par email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // 3. Comparer password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // 4. Générer token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // 5. Renvoyer token + user
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("[LOGIN] Error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
