import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { login } from "../../axios";

// Асинхронный thunk для входа
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token); // Сохраняем токен в localStorage
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронный thunk для проверки токена
export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      return response.data; // Возвращаем данные пользователя
    } catch (error) {
      localStorage.removeItem("token"); // Удаляем невалидный токен
      return rejectWithValue(
        error.response?.data?.message || "Ошибка авторизации"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null, // Загружаем токен из localStorage
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token"); // Удаляем токен из localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token); // Сохраняем токен в localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
