import Category from "../models/Category.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

// Управление категориями
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "fullName");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении категорий" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res
        .status(400)
        .json({ message: "Название категории обязательно" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Категория с таким названием уже существует" });
    }
    const category = new Category({
      name,
      createdBy: req.user.userId,
    });
    await category.save();
    res.json(category);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Ошибка при создании категории", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!category)
      return res.status(404).json({ message: "Категория не найдена" });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении категории" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Категория не найдена" });
    await Video.updateMany(
      { categories: req.params.id },
      { $pull: { categories: req.params.id } }
    );
    res.json({ message: "Категория удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении категории" });
  }
};

// Управление пользователями
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении пользователей" });
  }
};

export const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с такой почтой уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullname,
      email,
      passwordHash: hashedPassword,
      role: role || "user",
    });

    await user.save();
    res.json({ message: "Пользователь успешно создан", user });
  } catch (error) {
    res.status(400).json({
      message: "Ошибка при создании пользователя",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;
    const updateData = { fullname, role };

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res
          .status(400)
          .json({ message: "Этот email уже занят другим пользователем" });
      }
      updateData.email = email;
    }

    if (password) {
      const minLength = 6;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      if (password.length < minLength || !hasLetter || !hasNumber) {
        return res.status(400).json({
          message:
            "Пароль должен содержать минимум 6 символов, включая буквы и цифры",
        });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении пользователя" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
    res.json({ message: "Пользователь удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении пользователя" });
  }
};

// Управление видео
export const updateVideo = async (req, res) => {
  try {
    const { title, description, categories, tags } = req.body;
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { title, description, categories, tags },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: "Видео не найдено" });
    res.json({ success: true, video });
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении видео" });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: "Видео не найдено" });
    res.json({ message: "Видео удалено" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении видео" });
  }
};
