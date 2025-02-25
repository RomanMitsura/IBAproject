// src/redux/slices/theme.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: localStorage.getItem("isDarkMode") === "true", // Загружаем состояние из localStorage
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", state.isDarkMode); // Сохраняем состояние в localStorage
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
