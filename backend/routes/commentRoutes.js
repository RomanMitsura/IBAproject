import { Router } from "express";
import {
  addComment,
  removeComment,
  getComments,
} from "../controllers/comentController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.get("/:videoId", getComments);
router.post("/:videoId", authMiddleware, addComment);
router.delete("/:videoId/:commentId", authMiddleware, removeComment);

export default router;
