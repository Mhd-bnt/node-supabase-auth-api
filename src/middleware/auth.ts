import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access denied. Invalid token format",
      });
    }

    // Vérifier token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: number;
      email: string;
    };

    // Ajouter user à req
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error: any) {
    console.error("[AUTH_MIDDLEWARE] Error:", error);
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};
