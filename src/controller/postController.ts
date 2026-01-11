// import prisma from "../config/supabase";
// import { Prisma } from "@prisma/client";

// import { Request, Response } from "express";

// export const createPost = async (req: Request, res: Response) => {
//   try {
//     const { title, content, authorId } = req.body;
//     const authId = parseInt(authorId);

//     // Validation Id:
//     if (isNaN(authId) || authId <= 0 || !Number.isInteger(authId)) {
//       return res.status(400).json({
//         error: "Invalid id format",
//       });
//     }
//     // Validation title :
//     if (!title || title.trim() === "") {
//       return res.status(400).json({
//         error: "Title is required",
//       });
//     }

//     if (title.trim().length < 3 || title.trim().length > 200) {
//       return res.status(400).json({
//         error: "Title must be between 3 and 200 characters",
//       });
//     }

//     // Validation author exists :
//     const userExists = await prisma.user.findUnique({
//       where: { id: authId },
//     });

//     if (!userExists) {
//       return res.status(404).json({
//         error: "Author not found",
//       });
//     }
//     const post = await prisma.post.create({
//       data: { content, authorId: authId, title: title.trim() },
//     });

//     res.status(201).json({
//       message: "Post created successfully !",
//       post,
//     });
//   } catch (error: any) {
//     console.error(`[CREATE_POST] Error: `, {
//       error: error.message,
//       code: error.code,
//     });

//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

// // ============================================
// // EXERCISE 2: GET ALL POSTS
// // ============================================

// export const getAllPosts = async (req: Request, res: Response) => {
//   try {
//     const { published } = req.query; // ← Query params (pas params)

//     // Construire le filtre
//     const where: Prisma.PostWhereInput = {};

//     if (published !== undefined) {
//       // Convertir string "true"/"false" en boolean
//       where.published = published === "true";
//     }

//     // Récupérer les posts
//     const posts = await prisma.post.findMany({
//       where,
//       orderBy: { createdAt: "desc" },
//     });

//     res.status(200).json({
//       message: "Posts retrieved successfully",
//       count: posts.length,
//       posts,
//     });
//   } catch (error: any) {
//     console.error("[GET_ALL_POSTS] Error:", {
//       error: error.message,
//       code: error.code,
//     });

//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

// // ============================================
// // EXERCISE 3: GET SINGLE POST
// // ============================================

// export const getPost = async (req: Request, res: Response) => {
//   try {
//     const { postId } = req.params;
//     const id = parseInt(postId);

//     // Validation id :
//     if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
//       return res.status(400).json({
//         error: "Invalide input format",
//       });
//     }

//     const post = await prisma.post.findUnique({
//       where: { id },
//       include: { User: true },
//     });

//     if (!post) {
//       return res.status(404).json({
//         error: "Post not found",
//       });
//     }

//     res.status(200).json({
//       message: "Post found !",
//       post,
//     });
//   } catch (error: any) {
//     console.error("[GET_POST] Error:", {
//       error: error.message,
//       code: error.code,
//     });

//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

// // ============================================
// // EXERCISE 4: UPDATE POST
// // ============================================

// export const updatePost = async (req: Request, res: Response) => {
//   try {
//     const { postId } = req.params;
//     const { authorId, title, content, published } = req.body;

//     const id = parseInt(postId);
//     const authId = parseInt(authorId);

//     // Validation postId
//     if (isNaN(id) || id <= 0 || !Number.isInteger(id)) {
//       return res.status(400).json({
//         error: "Invalid post ID",
//       });
//     }

//     // Validation authorId
//     if (isNaN(authId) || authId <= 0 || !Number.isInteger(authId)) {
//       return res.status(400).json({
//         error: "Invalid author ID",
//       });
//     }

//     // Validation title (si fourni)
//     if (title !== undefined) {
//       if (!title || title.trim() === "") {
//         return res.status(400).json({
//           error: "Title cannot be empty",
//         });
//       }

//       if (title.trim().length < 3 || title.trim().length > 200) {
//         return res.status(400).json({
//           error: "Title must be between 3 and 200 characters",
//         });
//       }
//     }

//     // Vérifier que le post existe ET récupérer authorId
//     const existingPost = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (!existingPost) {
//       return res.status(404).json({
//         error: "Post not found",
//       });
//     }

//     // Vérifier ownership AVANT update
//     if (existingPost.authorId !== authId) {
//       return res.status(403).json({
//         error: "Unauthorized: You can only update your own posts",
//       });
//     }

//     // Définis le type
//     interface UpdateData {
//       title?: string;
//       content?: string | null;
//       published?: boolean;
//     }

//     // Préparer les données à mettre à jour
//     const dataToUpdate: UpdateData = {};
//     if (title !== undefined) dataToUpdate.title = title.trim();
//     if (content !== undefined) dataToUpdate.content = content;
//     if (published !== undefined) dataToUpdate.published = published;

//     // Update le post
//     const post = await prisma.post.update({
//       where: { id },
//       data: dataToUpdate,
//     });

//     res.status(200).json({
//       message: "Post updated successfully",
//       post,
//     });
//   } catch (error: any) {
//     console.error("[UPDATE_POST] Error:", {
//       error: error.message,
//       code: error.code,
//     });

//     if (error.code === "P2025") {
//       return res.status(404).json({
//         error: "Post not found",
//       });
//     }

//     res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// };

import { Request, Response } from "express";
import prisma from "../config/supabase";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    // Récupérer authorId (avec type assertion)
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error: any) {
    console.error("[CREATE_POST] Error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
