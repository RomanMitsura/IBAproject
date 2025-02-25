import { Router } from "express";
import {
  editUser,
  deleteUser,
  getUser,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = new Router();

// Изменение данных пользователя
router.patch("/:userId", authMiddleware, upload.single("avatar"), editUser);

//Удаление пользователя
router.delete("/:userId", authMiddleware, deleteUser);

router.get("/:userId", getUser);

export default router;
