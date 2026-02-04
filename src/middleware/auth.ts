import { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("[AUTH] JWT_SECRET is missing from variable environement");
}

export const auth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token is missing",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid payload",
      });
    }

    const payload = decoded as JwtPayload;
    const { userId, email } = payload;

    if (typeof userId !== "number" || typeof email !== "string") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Payload is missing",
      });
    }

    req.user = { id: userId, email };
    next();
  } catch (error: unknown) {
    const jwtError = error as { name?: string };

    if (jwtError?.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token expired",
      });
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid Token",
    });
  }
};
