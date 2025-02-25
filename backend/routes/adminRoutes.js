// routes/admin.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateVideo,
  deleteVideo,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/categories", [authMiddleware, adminMiddleware], getCategories);
router.post("/categories", [authMiddleware, adminMiddleware], createCategory);
router.put(
  "/categories/:id",
  [authMiddleware, adminMiddleware],
  updateCategory
);
router.delete(
  "/categories/:id",
  [authMiddleware, adminMiddleware],
  deleteCategory
);

router.get("/users", [authMiddleware, adminMiddleware], getUsers);
router.post("/users", [authMiddleware, adminMiddleware], createUser);
router.put("/users/:id", [authMiddleware, adminMiddleware], updateUser);
router.delete("/users/:id", [authMiddleware, adminMiddleware], deleteUser);

router.put("/videos/:id", [authMiddleware, adminMiddleware], updateVideo);
router.delete("/videos/:id", [authMiddleware, adminMiddleware], deleteVideo);

export default router;
