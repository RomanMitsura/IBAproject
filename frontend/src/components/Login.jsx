import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slices/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        general: "",
      });
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Ошибка входа:", error);
      const serverError = error.message || "Неверный email или пароль";
      if (serverError === "Неверный email или пароль") {
        setErrors({ email: "", password: "", general: serverError });
      } else {
        setErrors({ email: "", password: "", general: "Ошибка сервера" });
      }
    }
  };

  return (
    <div className="flex relative flex-col gap-4 items-center justify-center min-h-screen max-h-screen">
      <Link to={"/"} className="absolute top-0 left-0 p-4">
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
      <h1 className="font-bold text-xl">Вход</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="flex flex-col gap-1 group relative">
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
              errors.email || errors.general
                ? "border-red-500"
                : "focus:border-blue-400 "
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
              errors.password || errors.general
                ? "border-red-500"
                : "focus:border-blue-400 "
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
        {errors.general && (
          <p className="text-red-500 text-center text-sm">{errors.general}</p>
        )}
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300"
        >
          Войти
        </button>
      </form>
      <Link to={"/registration"}>
        <span className="text-sm dark:text-light-second-text dark:hover:text-dark-hover">
          Зарегистрироваться
        </span>
      </Link>
    </div>
  );
}
