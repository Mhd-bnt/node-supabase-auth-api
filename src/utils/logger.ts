import { config } from "../config/env";

export const logger = {
  logger: (message: string, ...meta: unknown[]) => {
    if (config.server.node_env === "development") {
      console.log(`[DEBUG] ${message}`, ...meta);
    }
  },

  info: (message: string, ...meta: unknown[]) => {
    console.log(`[INFO] ${message}`, ...meta);
  },
  warn: (message: string, ...meta: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...meta);
  },
  error: (message: string, ...meta: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...meta);
  },
};
