import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Video from "./Video.js";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "guest", "user"],
      default: "user",
    },
    avatarUrl: {
      type: String,
      default:
        "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this._conditions._id; // Получаем ID пользователя
  console.log("Начинаем удаление видео для пользователя:", userId);

  try {
    // Находим все видео пользователя
    const videos = await Video.find({ user: userId });
    console.log("Найденные видео:", videos);

    // Удаляем файлы видео
    for (const video of videos) {
      if (video.videoUrl) {
        const videoPath = path.join(process.cwd(), video.videoUrl);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
          console.log("Удалено видео:", videoPath);
        }
      }
      if (video.videoImageUrl) {
        const imagePath = path.join(process.cwd(), video.videoImageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Удалено изображение:", imagePath);
        }
      }
    }

    // Удаляем все видео из базы данных
    await Video.deleteMany({ user: userId });
    console.log("Видео успешно удалены из базы данных");

    next();
  } catch (error) {
    console.error("Ошибка при удалении видео:", error);
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
