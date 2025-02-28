import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";
import mongoose from "mongoose";

export const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.userId;
    const playlists = await Playlist.find({ user: userId }).populate({
      path: "videos",
      populate: { path: "user", select: "fullname avatarUrl" },
    });

    const transformedPlaylists = playlists.map((playlist) => {
      const videos = playlist.videos.map((video) => {
        const fullVideoImageUrl = video.videoImageUrl
          ? `${req.protocol}://${req.get("host")}/${video.videoImageUrl.replace(/\\/g, "/")}`
          : "https://via.placeholder.com/150";
        const fullAvatarUrl = video.user?.avatarUrl
          ? `${req.protocol}://${req.get("host")}${video.user.avatarUrl.replace(/\\/g, "/")}`
          : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

        return {
          ...video._doc,
          videoImageUrl: fullVideoImageUrl,
          user: video.user
            ? {
                ...video.user._doc,
                avatarUrl: fullAvatarUrl,
              }
            : null,
        };
      });
      return { ...playlist._doc, videos };
    });

    res.status(200).json({ success: true, playlists: transformedPlaylists });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getPublicPlaylistsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    const playlists = await Playlist.find({
      user: userId,
      isPublic: true,
    }).populate({
      path: "videos",
      populate: { path: "user", select: "fullname avatarUrl" },
    });

    const transformedPlaylists = playlists.map((playlist) => {
      const videos = playlist.videos.map((video) => {
        const fullVideoImageUrl = video.videoImageUrl
          ? `${req.protocol}://${req.get("host")}/${video.videoImageUrl.replace(/\\/g, "/")}`
          : "https://via.placeholder.com/150";
        const fullAvatarUrl = video.user?.avatarUrl
          ? `${req.protocol}://${req.get("host")}${video.user.avatarUrl.replace(/\\/g, "/")}`
          : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

        return {
          ...video._doc,
          videoImageUrl: fullVideoImageUrl,
          user: video.user
            ? {
                ...video.user._doc,
                avatarUrl: fullAvatarUrl,
              }
            : null,
        };
      });
      return { ...playlist._doc, videos };
    });

    res.status(200).json({ success: true, playlists: transformedPlaylists });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const userId = req.user.userId;

    if (!title) {
      return res
        .status(400)
        .json({ message: "Название плейлиста обязательно" });
    }

    const playlist = new Playlist({
      title,
      description: description || "",
      user: userId,
      videos: [],
      isPublic: isPublic || false,
    });
    await playlist.save();

    res.status(201).json({
      success: true,
      message: "Плейлист создан",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title, description, isPublic } = req.body;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ message: "Некорректный ID плейлиста" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }
    if (playlist.user.toString() !== userId) {
      return res.status(403).json({ message: "Нет прав для редактирования" });
    }

    if (title) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;

    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Плейлист обновлен",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      return res.status(400).json({ message: "Некорректный ID плейлиста" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }
    if (playlist.user.toString() !== userId) {
      return res.status(403).json({ message: "Нет прав для удаления" });
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
      success: true,
      message: "Плейлист удален",
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user.userId;

    if (
      !mongoose.Types.ObjectId.isValid(playlistId) ||
      !mongoose.Types.ObjectId.isValid(videoId)
    ) {
      return res.status(400).json({ message: "Некорректный ID" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }
    if (playlist.user.toString() !== userId) {
      return res.status(403).json({ message: "Нет прав для редактирования" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ message: "Видео уже в плейлисте" });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Видео добавлено в плейлист",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user.userId;

    if (
      !mongoose.Types.ObjectId.isValid(playlistId) ||
      !mongoose.Types.ObjectId.isValid(videoId)
    ) {
      return res.status(400).json({ message: "Некорректный ID" });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Плейлист не найден" });
    }
    if (playlist.user.toString() !== userId) {
      return res.status(403).json({ message: "Нет прав для редактирования" });
    }

    playlist.videos = playlist.videos.filter((id) => id.toString() !== videoId);
    await playlist.save();

    res.status(200).json({
      success: true,
      message: "Видео удалено из плейлиста",
      playlist,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
