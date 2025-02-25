// loaders/userVideosLoader.js
import axios from "../axios";

export const userVideosLoader = async ({ params, request }) => {
  const { userId } = params; // Получаем ID пользователя из параметров маршрута

  // Извлекаем query-параметры из URL
  const url = new URL(request.url);
  const sortBy = url.searchParams.get("sortBy") || "new"; // По умолчанию "new"

  try {
    const response = await axios.get(`/videos/user/${userId}`, {
      params: { sortBy }, // Передаем параметр сортировки на сервер
    });
    return response.data.videos || [];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Видео не найдены для пользователя:", userId);
      return []; // Возвращаем пустой массив, если видео нет
    }
    console.error("Ошибка загрузчика:", error);
    throw new Error("Ошибка при загрузке видео");
  }
};
