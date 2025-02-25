import Video from "../models/Video.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

// Добавление видео
export const addVideo = async (req, res) => {
  try {
    const { title, description, categories } = req.body;

    if (
      !title ||
      !description ||
      !req.files["video"] ||
      !req.files["image"] ||
      !categories
    ) {
      return res.status(400).json({
        message: "Заполните все обязательные поля, включая категории",
      });
    }

    const userId = req.user?.userId; // Получаем userId из токена
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    // Парсим категории из строки JSON в массив
    let categoriesArray;
    try {
      categoriesArray = JSON.parse(categories);
      if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
        return res
          .status(400)
          .json({ message: "Категории должны быть непустым массивом" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Некорректный формат категорий" });
    }

    // Проверяем валидность каждого ID категории
    for (const catId of categoriesArray) {
      if (!mongoose.Types.ObjectId.isValid(catId)) {
        return res
          .status(400)
          .json({ message: `Некорректный ID категории: ${catId}` });
      }
    }

    // Получаем пути к загруженным файлам
    const videoFile = req.files["video"][0];
    const imageFile = req.files["image"][0];

    // Создаем новое видео без тегов
    const newVideo = new Video({
      title,
      description,
      videoUrl: videoFile.path,
      videoImageUrl: imageFile.path,
      categories: categoriesArray,
      user: userId,
    });

    // Сохраняем видео
    await newVideo.save();

    // Подгружаем данные пользователя и категорий
    const populatedVideo = await Video.findById(newVideo._id)
      .populate("user", "fullname avatarUrl")
      .populate("categories", "name")
      .exec();

    res.status(201).json({
      success: true,
      message: "Видео успешно добавлено",
      video: {
        id: populatedVideo._id,
        title: populatedVideo.title,
        description: populatedVideo.description,
        videoUrl: populatedVideo.videoUrl,
        videoImageUrl: populatedVideo.videoImageUrl,
        categories: populatedVideo.categories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
        user: populatedVideo.user,
        createdAt: populatedVideo.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка при добавлении видео:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение одного видео
export const getOneVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }
    const video = await Video.findById(videoId)
      .populate("user", "fullname avatarUrl")
      .populate("categories", "name")
      .exec();
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }
    video.views++;
    await video.save();

    const fullVideoUrl = `${req.protocol}://${req.get("host")}/${video.videoUrl.replace(/\\/g, "/")}`;
    const fullVideoImageUrl = `${req.protocol}://${req.get("host")}/${video.videoImageUrl.replace(/\\/g, "/")}`;
    const fullAvatarUrl = video.user.avatarUrl
      ? `${req.protocol}://${req.get("host")}${video.user.avatarUrl.replace(/\\/g, "/")}`
      : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

    res.status(200).json({
      success: true,
      video: {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: fullVideoUrl,
        videoImageUrl: fullVideoImageUrl,
        categories: video.categories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
        user: {
          _id: video.user._id,
          fullname: video.user.fullname,
          avatarUrl: fullAvatarUrl,
        },
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        likedBy: video.likedBy,
        dislikedBy: video.dislikedBy,
        createdAt: video.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении видео:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение всех видео
export const getAllVideos = async (req, res) => {
  try {
    const { category, sortBy, search } = req.query;
    const filter = {};

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Некорректный ID категории" });
      }
      filter.categories = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    if (sortBy === "views") {
      sortOptions.views = -1;
    } else if (sortBy === "likes") {
      sortOptions.likes = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const videos = await Video.find(filter)
      .sort(sortOptions)
      .populate("user", "fullname avatarUrl")
      .populate("categories", "name")
      .exec();

    if (videos.length === 0) {
      return res.status(200).json({
        success: true,
        videos: [],
        message: category
          ? "Видео с такой категорией не найдены"
          : "Видео не найдены",
      });
    }

    const formattedVideos = videos.map((video) => {
      const fullVideoUrl = `${req.protocol}://${req.get("host")}/${video.videoUrl.replace(/\\/g, "/")}`;
      const fullVideoImageUrl = `${req.protocol}://${req.get("host")}/${video.videoImageUrl.replace(/\\/g, "/")}`;
      const fullAvatarUrl = video.user.avatarUrl
        ? `${req.protocol}://${req.get("host")}${video.user.avatarUrl.replace(/\\/g, "/")}`
        : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: fullVideoUrl,
        videoImageUrl: fullVideoImageUrl,
        categories: video.categories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
        user: {
          _id: video.user._id,
          fullname: video.user.fullname,
          avatarUrl: fullAvatarUrl,
        },
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        createdAt: video.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      videos: formattedVideos,
    });
  } catch (error) {
    console.error("Ошибка при получении видео:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удаление видео
export const removeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const userId = req.user?.userId;
    if (
      video.user.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "У вас нет прав для удаления видео" });
    }

    const videoFilePath = path.resolve(video.videoUrl);
    const imageFilePath = path.resolve(video.videoImageUrl);

    if (fs.existsSync(videoFilePath)) {
      fs.unlinkSync(videoFilePath);
    } else {
      console.warn("Видеофайл не найден:", videoFilePath);
    }

    if (fs.existsSync(imageFilePath)) {
      fs.unlinkSync(imageFilePath);
    } else {
      console.warn("Изображение не найдено:", imageFilePath);
    }

    await Video.findByIdAndDelete(videoId);

    res.status(200).json({
      success: true,
      message: "Видео успешно удалено",
    });
  } catch (error) {
    console.error("Ошибка при удалении видео:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Редактирование видео
export const editVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const userId = req.user?.userId;
    const isVideoAuthor = video.user.toString() === userId;
    const isAdmin = req.user.role === "admin";

    if (!isVideoAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ message: "У вас нет прав для редактирования видео" });
    }

    const { title, description, categories } = req.body;

    if (title) video.title = title;
    if (description) video.description = description;

    if (categories) {
      let categoriesArray;
      try {
        categoriesArray = JSON.parse(categories);
        if (!Array.isArray(categoriesArray) || categoriesArray.length === 0) {
          return res
            .status(400)
            .json({ message: "Категории должны быть непустым массивом" });
        }
        for (const catId of categoriesArray) {
          if (!mongoose.Types.ObjectId.isValid(catId)) {
            return res
              .status(400)
              .json({ message: `Некорректный ID категории: ${catId}` });
          }
        }
        video.categories = categoriesArray;
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Некорректный формат категорий" });
      }
    }

    if (req.files) {
      const videoFile = req.files.find((file) => file.fieldname === "video");
      const imageFile = req.files.find((file) => file.fieldname === "image");

      if (videoFile) {
        const oldVideoPath = path.resolve(video.videoUrl);
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
        video.videoUrl = `uploads/${videoFile.filename}`;
      }

      if (imageFile) {
        const oldImagePath = path.resolve(video.videoImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        video.videoImageUrl = `uploads/${imageFile.filename}`;
      }
    }

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate("user", "fullname avatarUrl")
      .populate("categories", "name")
      .exec();

    res.status(200).json({
      success: true,
      message: "Видео успешно обновлено",
      video: {
        id: updatedVideo._id,
        title: updatedVideo.title,
        description: updatedVideo.description,
        videoUrl: updatedVideo.videoUrl,
        videoImageUrl: updatedVideo.videoImageUrl,
        categories: updatedVideo.categories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
        user: updatedVideo.user,
        createdAt: updatedVideo.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка при редактировании видео:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Получение видео пользователя
export const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy } = req.query;

    const filter = { user: userId };

    const sortOptions = {};
    if (sortBy === "views") {
      sortOptions.views = -1;
    } else if (sortBy === "likes") {
      sortOptions.likes = -1;
    } else {
      sortOptions.createdAt = -1;
    }

    const videos = await Video.find(filter)
      .sort(sortOptions)
      .populate("user", "fullname avatarUrl")
      .populate("categories", "name")
      .exec();

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Видео не найдены",
      });
    }

    const formattedVideos = videos.map((video) => {
      const fullVideoUrl = `${req.protocol}://${req.get("host")}/${video.videoUrl.replace(/\\/g, "/")}`;
      const fullVideoImageUrl = `${req.protocol}://${req.get("host")}/${video.videoImageUrl.replace(/\\/g, "/")}`;
      const fullAvatarUrl = video.user.avatarUrl
        ? `${req.protocol}://${req.get("host")}${video.user.avatarUrl.replace(/\\/g, "/")}`
        : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

      return {
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: fullVideoUrl,
        videoImageUrl: fullVideoImageUrl,
        categories: video.categories.map((cat) => ({
          _id: cat._id,
          name: cat.name,
        })),
        user: {
          _id: video.user._id,
          fullname: video.user.fullname,
          avatarUrl: fullAvatarUrl,
        },
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        likedBy: video.likedBy,
        dislikedBy: video.dislikedBy,
        createdAt: video.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      videos: formattedVideos,
    });
  } catch (error) {
    console.error("Ошибка при получении видео пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Поставить лайк
export const likeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const userLiked = video.likedBy.includes(userId);
    const userDisliked = video.dislikedBy.includes(userId);

    if (userLiked) {
      video.likedBy.pull(userId);
      video.likes -= 1;
    } else if (userDisliked) {
      video.dislikedBy.pull(userId);
      video.dislikes -= 1;
      video.likedBy.push(userId);
      video.likes += 1;
    } else {
      video.likedBy.push(userId);
      video.likes += 1;
    }

    await video.save();
    res.status(200).json({
      success: true,
      likes: video.likes,
      dislikes: video.dislikes,
      likedBy: video.likedBy,
      dislikedBy: video.dislikedBy,
    });
  } catch (error) {
    console.error("Ошибка при постановке лайка:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Поставить дизлайк
export const dislikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: "Некорректный ID видео" });
    }
    if (!userId) {
      return res.status(401).json({ message: "Пользователь не авторизован" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Видео не найдено" });
    }

    const userLiked = video.likedBy.includes(userId);
    const userDisliked = video.dislikedBy.includes(userId);

    if (userDisliked) {
      video.dislikedBy.pull(userId);
      video.dislikes -= 1;
    } else if (userLiked) {
      video.likedBy.pull(userId);
      video.likes -= 1;
      video.dislikedBy.push(userId);
      video.dislikes += 1;
    } else {
      video.dislikedBy.push(userId);
      video.dislikes += 1;
    }

    await video.save();
    res.status(200).json({
      success: true,
      likes: video.likes,
      dislikes: video.dislikes,
      likedBy: video.likedBy,
      dislikedBy: video.dislikedBy,
    });
  } catch (error) {
    console.error("Ошибка при постановке дизлайка:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
