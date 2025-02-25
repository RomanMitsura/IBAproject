import { useState } from "react";
import axios from "../axios"; // Импортируем Axios для отправки запросов
import { Link, useNavigate } from "react-router-dom";
import { showSuccess } from "./Notification";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
        setError(err.response.data.message || "Произошла ошибка");
      } else {
        setError("Не удалось подключиться к серверу");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
              className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              placeholder="Введите имя пользователя"
              required
            />
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
              className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              placeholder="Введите email"
              required
            />
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
              className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              placeholder="Введите пароль"
              required
            />
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
    </>
  );
}
