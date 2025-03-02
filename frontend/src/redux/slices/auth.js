import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { login } from "../../utils/axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
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
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
    isAuthChecked: false,
    isSessionExpiredModalOpen: false,
    hasSessionExpiredNotified:
      localStorage.getItem("hasSessionExpiredNotified") === "true" || false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthChecked = true;
      state.isSessionExpiredModalOpen = false;
      state.hasSessionExpiredNotified = false;
      localStorage.removeItem("token");
      localStorage.removeItem("hasSessionExpiredNotified");
    },
    openSessionExpiredModal: (state) => {
      if (!state.hasSessionExpiredNotified) {
        state.isSessionExpiredModalOpen = true;
        state.hasSessionExpiredNotified = true;
      }
    },
    closeSessionExpiredModal: (state) => {
      state.isSessionExpiredModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthChecked = true;
        state.isSessionExpiredModalOpen = false;
        state.hasSessionExpiredNotified = false;
        localStorage.removeItem("hasSessionExpiredNotified");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = "loading";
        state.isAuthChecked = false;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.token = null;
        state.isAuthChecked = true;
      });
  },
});

export const { logout, openSessionExpiredModal, closeSessionExpiredModal } =
  authSlice.actions;
export default authSlice.reducer;
