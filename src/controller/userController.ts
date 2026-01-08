import prisma from "../config/supabase";
import { Request, Response } from "express";

// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email } = req.body;

//     // Validation name :
//     if (!name || name.length > 50) {
//       return res.status(400).json({
//         error: "Inavlid input format",
//       });
//     }

//     // Validation email:
//     if (!email || email.length > 100) {
//       return res.status(400).json({
//         error: "Invalide email format",
//       });
//     }

//     const user = await prisma.user.create({
//       data: { name, email },
//     });

//     res.status(201).json({
//       message: "User successfully created !",
//       user,
//     });
//   } catch (error: any) {
//     console.error(`[CREATE_USER] Error: `, {
//       error: error.message,
//       code: error.code,
//     });
//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

// GET ALL USER :

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      message: "Every user successfully fetched !",
      users,
    });
  } catch (error: any) {
    console.error("[GET_ALL_USERS] Error:", {
      error: error.message,
      code: error.code,
    });
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// Find one user :

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const id = parseInt(userId);

    // Validation id:
    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      return res.status(403).json({
        error: "Invalid id format",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({
        error: "No user was found",
      });
    }
    res.status(200).json({
      message: "User successfully found !",
      user,
    });
  } catch (error: any) {
    console.error("[GET_USER] Error:", {
      error: error.message,
      code: error.code,
    });

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

// DELETE USER :

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const id = parseInt(userId);

    // Validation id :
    if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
      return res.status(400).json({
        error: "Invalid id format",
      });
    }

    const user = await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      message: "user was successfully deleted",
      user,
    });
  } catch (error: any) {
    console.error("[DELETE_USER] Error: ", {
      error: error.message,
      code: error.code,
    });
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "No user was found",
      });
    }

    res.status(500).json({
      error: error.message,
    });
  }
};
