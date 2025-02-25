import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name _id"); // Возвращаем только нужные поля
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении категорий" });
  }
};
