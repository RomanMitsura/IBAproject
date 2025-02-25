import Video from "../models/Video.js";
import mongoose from "mongoose";

// Добавление комментария
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const newComment = {
      text,
      user: userId,
      createdAt: new Date(),
    };

    video.comments.push(newComment);
    await video.save();

    res.status(201).json({
      success: true,
      message: "Комментарий успешно добавлен",
      comment: newComment,
    });
  } catch (error) {
    console.error("Ошибка при добавлении комментария:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удаление комментария
export const removeComment = async (req, res) => {
  try {
    const { commentId, videoId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(videoId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res
        .status(400)
        .json({ message: "Некорректный ID видео или комментария" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const commentIndex = video.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Комментарий не найден" });
    }

    const userId = req.user?.userId;

    if (
      video.comments[commentIndex].user.toString() !== userId &&
      req.user.role !== "admin" &&
      video.user.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Нет прав для удаления комментария" });
    }

    video.comments.splice(commentIndex, 1);

    await video.save();

    res.status(200).json({
      success: true,
      message: "Комментарий успешно удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении комментария:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение комментариев
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }

    const video = await Video.findById(videoId).populate(
      "comments.user",
      "fullname avatarUrl"
    );
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const comments = video.comments
      .map((comment) => {
        if (!comment || typeof comment !== "object") {
          return null;
        }

        const user = comment.user && comment.user._doc ? comment.user._doc : {};

        return {
          ...comment._doc,
          user: {
            _id: user._id || null,
            fullname: user.fullname || "Неизвестный пользователь",
            avatarUrl: user.avatarUrl
              ? `${req.protocol}://${req.get("host")}${user.avatarUrl}`
              : "https://via.placeholder.com/28",
          },
        };
      })
      .filter((comment) => comment !== null);

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Ошибка при получении комментариев:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
