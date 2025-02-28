import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "./Notification";

export default function VideoForm({ isEdit = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { videoId } = useParams();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
        setError("Не удалось загрузить категории");
      }
    };

    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`/videos/${videoId}`);
        const video = response.data.video;
        setTitle(video.title);
        setDescription(video.description);
        setSelectedCategories(video.categories.map((cat) => cat._id || cat));
      } catch (error) {
        console.error("Ошибка при загрузке видео:", error);
        setError("Не удалось загрузить данные видео");
      }
    };

    fetchCategories();
    if (isEdit && videoId) {
      fetchVideoData();
    }
  }, [isEdit, videoId]);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      if (selectedCategories.length === 0) {
        showError("Выберите хотя бы одну категорию");
        setError("Выберите хотя бы одну категорию");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("categories", JSON.stringify(selectedCategories));
      if (videoFile) formData.append("video", videoFile);
      if (imageFile) formData.append("image", imageFile);

      const url = isEdit ? `/videos/${videoId}` : "/videos";
      const method = isEdit ? axios.patch : axios.post;

      const response = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSuccess(isEdit ? "Изменения сохранены" : "Видео успешно добавлено");
        navigate(isEdit ? `/${videoId}` : "/");
      } else {
        const errorMessage =
          response.data.message ||
          (isEdit ? "Ошибка при редактировании" : "Ошибка при добавлении");
        showError(errorMessage);
        setError(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (isEdit
          ? "Ошибка при редактировании видео"
          : "Ошибка при добавлении видео");
      showError(errorMessage);
      console.error(
        `Ошибка при ${isEdit ? "редактировании" : "добавлении"} видео:`,
        error
      );
      setError(errorMessage);
    }
  };

  return (
    <div className="flex relative flex-col gap-4 items-center justify-center min-h-screen max-h-screen">
      <Link to="/" className="absolute top-0 left-0 p-4">
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

      <h1 className="font-bold text-xl">
        {isEdit ? "Редактировать видео" : "Добавить видео"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="title"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Заголовок
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
            placeholder="Введите заголовок"
            required
          />
        </div>

        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="description"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
            placeholder="Введите описание"
            rows="3"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Категории</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                onClick={() => handleCategoryToggle(category._id)}
                className={`px-3 py-1 rounded-md border transition duration-300 ${
                  selectedCategories.includes(category._id)
                    ? "bg-light-active text-white border-main-light hover:bg-light-hover dark:bg-main-dark dark:border-main-dark dark:hover:bg-dark-hover"
                    : "bg-white border-gray-300 hover:bg-gray-100 dark:bg-[#0f0f0f] dark:text-white dark:border-gray-600 dark:hover:bg-dark-hover"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="video"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            {isEdit ? "Загрузить новое видео" : "Загрузить видео"}
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
            required={!isEdit}
          />
        </div>

        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="image"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            {isEdit ? "Загрузить новое изображение" : "Загрузить изображение"}{" "}
            <span className="text-light-second-text font-light text-center">
              jpeg/png
            </span>
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
            required={!isEdit}
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300"
        >
          {isEdit ? "Сохранить изменения" : "Добавить видео"}
        </button>
      </form>
    </div>
  );
}
