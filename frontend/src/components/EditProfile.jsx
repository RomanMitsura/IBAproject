import { useState, useEffect, useRef } from "react";
import axios from "../axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { NotificationContainer, showError, showSuccess } from "./Notification";

export default function EditProfile() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      console.log("User from Redux:", user);
      setFullname(user.fullname || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatarUrl || "");
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      if (fullname) formData.append("fullname", fullname);
      if (email) formData.append("email", email);
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatarFile) formData.append("avatar", avatarFile);

      const response = await axios.patch(`/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        showSuccess("Профиль успешно обновлен");
        setTimeout(() => navigate(`/profile/${user.id}`), 1500);
      }
    } catch (err) {
      console.error("Ошибка при редактировании профиля:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Произошла ошибка при обновлении профиля";
      showError(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NotificationContainer />
      <div className="flex relative flex-col gap-4 items-center justify-center min-h-screen max-h-screen">
        <Link to={`/profile/${user?.id}`} className="absolute top-0 left-0 p-4">
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

        <h1 className="font-bold text-xl">Редактирование профиля</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-sm"
        >
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex flex-col items-center">
            <div
              className="group relative cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover transition-all duration-300 group-hover:brightness-75 group-hover:scale-105"
                onError={(e) => {
                  console.log("Ошибка загрузки аватара:", avatarPreview);
                  e.target.src =
                    "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-semibold bg-black/50 rounded-full px-2 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              id="avatar"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <span className="text-light-second-text font-light text-center mt-2">
              jpeg/png/webp
            </span>
          </div>

          <div className="flex flex-col group relative">
            <label
              htmlFor="fullname"
              className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
            >
              Имя пользователя
            </label>
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
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
              htmlFor="currentPassword"
              className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
            >
              Текущий пароль
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              placeholder="Введите текущий пароль"
            />
          </div>

          <div className="flex flex-col gap-1 group relative">
            <label
              htmlFor="newPassword"
              className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
            >
              Новый пароль
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              placeholder="Введите новый пароль"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-3 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300"
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </form>

        <Link to={`/profile/${user?.id}`}>
          <span className="text-sm dark:text-light-second-text dark:hover:text-dark-hover">
            Отмена
          </span>
        </Link>
      </div>
    </>
  );
}
