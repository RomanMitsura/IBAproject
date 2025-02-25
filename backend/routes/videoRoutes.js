import { Router } from "express";

import {
  addVideo,
  getOneVideo,
  getAllVideos,
  removeVideo,
  editVideo,
  getUserVideos,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = new Router();

router.get("/", getAllVideos);
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  addVideo
);
router.get("/:videoId", getOneVideo);
router.get("/user/:userId", getUserVideos);
router.delete("/:videoId", authMiddleware, removeVideo);
router.patch("/:videoId", authMiddleware, upload.any(), editVideo);
router.post("/:videoId/like", authMiddleware, likeVideo);
router.post("/:videoId/dislike", authMiddleware, dislikeVideo);

export default router;
