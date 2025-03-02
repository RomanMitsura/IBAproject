import { useState } from "react";
import axios from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess } from "./Notification";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateUsername = (username) => {
    if (!username) return "Поле обязательно для заполнения";
    if (username.length < 2) {
      return "Имя пользователя должно содержать минимум 2 символа";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Поле обязательно для заполнения";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Введите корректный email";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Поле обязательно для заполнения";
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return "Пароль должен содержать минимум 6 символов";
    }
    if (!hasLetter || !hasNumber) {
      return "Пароль должен содержать буквы и цифры";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", email: "", password: "" });
    setLoading(true);

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (usernameError || emailError || passwordError) {
      setErrors({
        username: usernameError,
        email: emailError,
        password: passwordError,
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("auth/register", {
        email,
        fullname: username,
        password,
      });

      if (response.status === 200) {
        showSuccess("Пользователь успешно зарегистрирован!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      if (err.response && err.response.data) {
        const serverError = err.response.data.message;
        if (serverError.includes("email")) {
          setErrors((prev) => ({ ...prev, email: serverError }));
        } else if (serverError.includes("пароль")) {
          setErrors((prev) => ({ ...prev, password: serverError }));
        } else {
          setErrors((prev) => ({ ...prev, username: serverError }));
        }
      } else {
        setErrors({
          username: "",
          email: "",
          password: "Не удалось подключиться к серверу",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex relative flex-col gap-4 items-center justify-center min-h-screen max-h-screen">
      <Link to={"/login"} className="absolute top-0 left-0 p-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </Link>

      <h1 className="font-bold text-xl">Регистрация</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-sm"
      >
        <div className="flex flex-col group relative">
          <label
            htmlFor="username"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Имя пользователя
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`px-3 py-2 rounded border focus:outline-none ${
              errors.username ? "border-red-500" : "focus:border-blue-400 "
            }`}
            placeholder="Введите имя пользователя"
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col group relative">
          <label
            htmlFor="email"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`px-3 py-2 rounded border focus:outline-none ${
              errors.email ? "border-red-500" : "focus:border-blue-400 "
            }`}
            placeholder="Введите email"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="password"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`px-3 py-2 rounded border focus:outline-none ${
              errors.password ? "border-red-500" : "focus:border-blue-400 "
            }`}
            placeholder="Введите пароль"
          />
          <p className="text-light-second-text text-xs mt-1">
            Минимум 6 символов, включая буквы и цифры
          </p>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-3 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300"
        >
          {loading ? "Загрузка..." : "Создать аккаунт"}
        </button>
      </form>

      <Link to={"/login"}>
        <span className="text-sm dark:text-light-second-text dark:hover:text-dark-hover">
          Уже есть аккаунт? Войти
        </span>
      </Link>
    </div>
  );
}
