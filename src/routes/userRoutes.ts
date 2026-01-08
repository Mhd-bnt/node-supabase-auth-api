import { Router } from "express";
import * as userController from "../controller/userController";

const router = Router();

router.get("/users", userController.getAllUsers);
router.get("/users/:userId", userController.getUser);
router.delete("/users/:userId", userController.deleteUser);

export default router;
