import Category from "../models/Category.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

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
    console.error("Ошибка в createCategory:", error);
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
    const { fullName, email, password, role } = req.body;
    const user = new User({ fullName, email, password, role });
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при создании пользователя" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, email, role },
      { new: true }
    ).select("-password");
    if (!user)
      return res.status(404).json({ message: "Пользователь не найден" });
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
