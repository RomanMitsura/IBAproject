import upload from "../middlewares/uploadMiddleware.js";
import path from "path";
import User from "../models/User.js";
import fs from "fs";
import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Изменение данных пользователя
export const editUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullname, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isAdmin = decoded.role === "admin";
    const isOwner = decoded.userId === userId;
    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "У вас нет прав для редактирования этого профиля" });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    if (req.file) {
      if (user.avatarUrl && !user.avatarUrl.startsWith("https://")) {
        const oldAvatarPath = path.join(
          process.cwd(),
          "uploads",
          path.basename(user.avatarUrl)
        );
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
          console.log(`Удален старый аватар: ${oldAvatarPath}`);
        }
      }
      user.avatarUrl = `/uploads/${req.file.filename}`;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Для изменения пароля необходимо указать текущий пароль",
        });
      }
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash
      );
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Текущий пароль неверен" });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Профиль успешно обновлен",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка при редактировании профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// Удаление пользователя
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const currentUser = req.user;
    const isAdmin = currentUser.role === "admin";
    const isOwner = currentUser.userId === userId;

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "У вас нет прав для удаления этого профиля" });
    }

    if (user.avatarUrl) {
      const avatarPath = path.join(process.cwd(), user.avatarUrl);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await User.findOneAndDelete({ _id: userId });

    res.status(200).json({
      success: true,
      message: "Профиль успешно удален",
    });
  } catch (error) {
    console.error("Ошибка при удалении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

// routes/users.js
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Неверный формат ID пользователя" });
    }

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const fullAvatarUrl = user.avatarUrl
      ? `${req.protocol}://${req.get("host")}${user.avatarUrl.replace(/\\/g, "/")}`
      : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatarUrl: fullAvatarUrl,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении профиля пользователя:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
};
