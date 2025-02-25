import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

// Интерцептор для добавления токена в заголовки запроса
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Токен не найден в localStorage");
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await instance.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка авторизации");
  }
};

export default instance;
