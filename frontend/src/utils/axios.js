import axios from "axios";
import store from "../redux/store";
import { openSessionExpiredModal } from "../redux/slices/auth";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("Токен не найден в localStorage");
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const hasNotified =
        localStorage.getItem("hasSessionExpiredNotified") === "true";
      if (!hasNotified) {
        store.dispatch(openSessionExpiredModal());
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await instance.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Ошибка авторизации");
  }
};

export default instance;
