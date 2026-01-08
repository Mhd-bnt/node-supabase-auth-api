import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Validation authHdeaer :

    if (!authHeader)
      return res.status(401).json({
        error: "No token was provided",
      });

    // Recvor token from headers :

    const token = authHeader.split("")[1];

    // Validation token :

    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: number;
      email: string;
    };

    // Add user to Request body :

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (error: any) {
    console.error("[auth_MIDDLEWARE]  Error: ", {
      error: error.message,
      code: error.code,
    });

    res.status(500).json({
      error: "Inernals server error",
    });
  }
};
