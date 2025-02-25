import { useState, useEffect } from "react";
import axios from "../axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { showError, showSuccess } from "./Notification";

export default function EditVideo() {
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
    const fetchData = async () => {
      try {
        const [videoResponse, categoriesResponse] = await Promise.all([
          axios.get(`/videos/${videoId}`),
          axios.get("/categories"),
        ]);
        const video = videoResponse.data.video;
        setTitle(video.title);
        setDescription(video.description);

        setSelectedCategories(video.categories.map((cat) => cat._id || cat));
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setError("Не удалось загрузить данные видео или категории");
      }
    };
    fetchData();
  }, [videoId]);

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
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      formData.append("categories", JSON.stringify(selectedCategories));
      if (videoFile) formData.append("video", videoFile);
      if (imageFile) formData.append("image", imageFile);

      const response = await axios.patch(`/videos/${videoId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        showSuccess("Изменения сохранены");
        navigate(`/${videoId}`);
      } else {
        showError(response.data.message || "Ошибка при редактировании видео");
        setError(response.data.message || "Ошибка при редактировании видео");
      }
    } catch (error) {
      showError("Ошибка при редактировании видео");
      console.error("Ошибка при редактировании видео:", error);
      setError(
        error.response?.data?.message || "Ошибка при редактировании видео"
      );
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
      <h1 className="font-bold text-xl">Редактировать видео</h1>
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
            Загрузить новое видео
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex flex-col gap-1 group relative">
          <label
            htmlFor="image"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Загрузить новое изображение
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
          />
        </div>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <button
          type="submit"
          className="px-3 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}
