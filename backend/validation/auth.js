import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail().withMessage("Введите корректный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов")
    .matches(/[a-zA-Z]/)
    .withMessage("Пароль должен содержать хотя бы одну букву")
    .matches(/\d/)
    .withMessage("Пароль должен содержать хотя бы одну цифру"),
  body("fullname")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Имя пользователя должно содержать минимум 2 символа"),
  body("avatarUrl")
    .optional()
    .isURL()
    .withMessage("URL аватара должен быть корректной ссылкой"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Введите корректный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов")
    .matches(/[a-zA-Z]/)
    .withMessage("Пароль должен содержать хотя бы одну букву")
    .matches(/\d/)
    .withMessage("Пароль должен содержать хотя бы одну цифру"),
];

export const createUserValidation = [
  body("email").isEmail().withMessage("Введите корректный email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов")
    .matches(/[a-zA-Z]/)
    .withMessage("Пароль должен содержать хотя бы одну букву")
    .matches(/\d/)
    .withMessage("Пароль должен содержать хотя бы одну цифру"),
  body("fullname")
    .isString()
    .isLength({ min: 2 })
    .withMessage("Имя пользователя должно содержать минимум 2 символа"),
  body("role")
    .optional()
    .isIn(["user", "admin", "guest"])
    .withMessage("Роль должна быть одной из: user, admin, guest"),
];
