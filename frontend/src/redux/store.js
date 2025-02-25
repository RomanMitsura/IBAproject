import { configureStore } from "@reduxjs/toolkit";
import { videosReducer } from "./slices/videos";
import authReducer from "./slices/auth";
import themeReducer from "./slices/theme";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    videos: videosReducer,
  },
});

export default store;
