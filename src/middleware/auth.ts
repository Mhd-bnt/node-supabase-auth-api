// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Récupérer header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided",
      });
    }

    // 2. Extraire token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Access denied. Invalid token format",
      });
    }

    // 3. Vérifier token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: number;
      email: string;
    };

    // 4. Ajouter user à req
    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    // 5. Continuer
    next();
  } catch (error: any) {
    console.error("[AUTHENTICATE_TOKEN] Error:", {
      error: error.message,
      code: error.code,
    });
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};
