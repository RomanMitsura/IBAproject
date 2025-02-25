import axios from "../axios";

export const userVideosLoader = async ({ params, request }) => {
  const { userId } = params;

  const url = new URL(request.url);
  const sortBy = url.searchParams.get("sortBy") || "new";

  try {
    const response = await axios.get(`/videos/user/${userId}`, {
      params: { sortBy },
    });
    return response.data.videos || [];
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("Видео не найдены для пользователя:", userId);
      return [];
    }
    console.error("Ошибка загрузчика:", error);
    throw new Error("Ошибка при загрузке видео");
  }
};
