import { Router } from "express";
import * as postController from "../controller/postController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Route protégée
router.post("/", authenticateToken, postController.createPost);

export default router;

// CONTEXT:
// A user wants to update their blog post.
// Only the author can update their own post.

// WHAT THE CLIENT SENDS:
// URL params: /posts/:postId
// Body: {
//   "title": "Updated Title",
//   "content": "Updated content...",
//   "published": true,
//   "authorId": 1
// }

// WHAT THE SERVER SHOULD RETURN:
// {
//   "message": "Post updated successfully",
//   "post": {
//     "id": 1,
//     "title": "Updated Title",
//     "content": "Updated content...",
//     "published": true,
//     "authorId": 1,
//     "createdAt": "2025-01-01T...",
//     "updatedAt": "2025-01-01T..." (auto-updated)
//   }
// }

// YOUR MISSION:
// - Validate postId and authorId
// - Validate title if provided (3-200 characters)
// - Check if post exists
// - Verify that authorId matches post.authorId (authorization)
// - Update the post
// - Return 403 if user is not the author
// - Return 404 if post not found

// ============================================
// EXERCISE 5: DELETE POST
// ============================================

// CONTEXT:
// A user wants to delete their blog post.
// Only the author can delete their own post.

// WHAT THE CLIENT SENDS:
// URL params: /posts/:postId
// Body: {
//   "authorId": 1
// }

// WHAT THE SERVER SHOULD RETURN:
// {
//   "message": "Post deleted successfully",
//   "postId": 1
// }

// YOUR MISSION:
// - Validate postId and authorId
// - Check if post exists
// - Verify that authorId matches post.authorId (authorization)
// - Delete the post
// - Return 403 if user is not the author
// - Return 404 if post not found

// ============================================
// EXERCISE 6: GET USER'S POSTS
// ============================================

// CONTEXT:
// Display all posts created by a specific user.

// WHAT THE CLIENT SENDS:
// URL params: /users/:userId/posts

// WHAT THE SERVER SHOULD RETURN:
// {
//   "message": "User posts retrieved successfully",
//   "userId": 1,
//   "count": 3,
//   "posts": [
//     {
//       "id": 5,
//       "title": "Latest Post",
//       "content": "...",
//       "published": true,
//       "createdAt": "2025-01-01T...",
//       "updatedAt": "2025-01-01T..."
//     },
//     // ... more posts
//   ]
// }

// YOUR MISSION:
// - Validate userId format
// - Check if user exists
// - Retrieve all posts by this user
// - Order by createdAt DESC
// - Return empty array if user has no posts
// - Return 404 if user not found

// ============================================
// REMINDER: COMMON PATTERNS
// ============================================

// Validation:
// - parseInt() for IDs
// - isNaN() check
// - trim() for strings
// - length checks

// Status codes:
// - 200: Success
// - 201: Created
// - 400: Bad request (validation failed)
// - 403: Forbidden (not authorized)
// - 404: Not found
// - 500: Server error

// Prisma errors:
// - P2003: Foreign key constraint
// - P2025: Record not found

// Always use return before res.json() in validations!
