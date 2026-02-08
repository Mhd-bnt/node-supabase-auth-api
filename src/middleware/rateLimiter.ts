import { rateLimit } from "express-rate-limit";
import { logger } from "../utils/logger";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (req, res) => {
    logger.warn(`[SECURITY] Rate limit exceeded`, {
      ip: req.ip,
      path: req.path,
      userAgent: req.headers["user-agent"],
    });

    return res.status(429).json({
      error: "TooManyRequests",
      message: "Too many attempts",
    });
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
