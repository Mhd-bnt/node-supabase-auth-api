// src/server.ts
import "dotenv/config";
import cors from "cors";
import express from "express";
import prisma from "./config/supabase";

const PORT = process.env.PORT || 9090;
const app = express();

// BASE MIDDLEWARE :

app.use(cors());
app.use(express.json());

// IMPORTING ROUTES :
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";

// MOUNTING ROUTES :
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// RUNNING SERVER :

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected via prisma");

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error: any) {
    console.error(`[START_SERVER] Error:`, {
      error: error.message,
      code: error.code,
    });

    process.exit(1);
  }
};

startServer();

// GRACEFULL SHUTDOWN :

const stopServer = async () => {
  try {
    await prisma.$disconnect();
    console.log("Database slowely disconnecting ...");

    console.log(`Server disconnecting ...`);
    process.exit(0);
  } catch (error: any) {
    console.error(`[STOP_SERVER] Error:`, {
      error: error.message,
      code: error.code,
    });
    process.exit(1);
  }
};

process.on("SIGINT", stopServer);
process.on("SIGTERM", stopServer);
