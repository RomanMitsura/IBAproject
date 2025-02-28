import express from "express";
import {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  getUserPlaylists,
  getPublicPlaylistsByUser,
} from "../controllers/playlistController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Получение плейлистов текущего пользователя
router.get("/", authMiddleware, getUserPlaylists);

// Получение публичных плейлистов другого пользователя
router.get("/user/:userId", getPublicPlaylistsByUser);

// Создание плейлиста
router.post("/", authMiddleware, createPlaylist);

// Редактирование плейлиста
router.put("/:playlistId", authMiddleware, updatePlaylist);

// Удаление плейлиста
router.delete("/:playlistId", authMiddleware, deletePlaylist);

// Добавление видео в плейлист
router.post("/:playlistId/videos/:videoId", authMiddleware, addVideoToPlaylist);

// Удаление видео из плейлиста
router.delete(
  "/:playlistId/videos/:videoId",
  authMiddleware,
  removeVideoFromPlaylist
);

export default router;
