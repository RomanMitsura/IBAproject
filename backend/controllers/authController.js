import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

//Регистрация
export const authRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Ошибка валидации", error: errors });
    }

    const { email, fullname, password, avatarUrl } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Пользователь с таким email уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      fullname,
      passwordHash: hashedPassword,
      avatarUrl,
    });

    await newUser.save();

    res
      .status(200)
      .json({ message: "Пользователь успешно добавлен", user: newUser });
  } catch (err) {
    console.log(err);
  }
};

//Авторизация
export const authLogin = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      console.log("Недостаточно данных для входа");
      return res.status(400).json({ message: "Введите пароль и email" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Пользователь не найден");
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log("Неверный пароль");
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, {
      expiresIn: "30d",
    });

    console.log("Успешный вход пользователя:", user.email);
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка при входе:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

//Проверка авторизации
export const checkAuth = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Токен не предоставлен" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // Проверяем токен
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }

    const fullAvatarUrl = user.avatarUrl
      ? `${req.protocol}://${req.get("host")}${user.avatarUrl.replace(/\\/g, "/")}`
      : "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";

    res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      avatarUrl: fullAvatarUrl,
      role: user.role,
    });
  } catch (error) {
    res.status(401).json({ message: "Невалидный токен" });
  }
};
