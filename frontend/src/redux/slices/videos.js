import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchVideos = createAsyncThunk(
  "videos/fetchVideos",
  async ({ sortBy, search, category }) => {
    const params = { sortBy };
    if (search) params.search = search;
    if (category) params.category = category;
    const { data } = await axios.get("/videos", { params });
    return data;
  }
);

const initialState = {
  videos: {
    items: [],
    status: "loading",
  },
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    resetVideos: (state) => {
      state.videos.items = [];
      state.videos.status = "loading";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.videos.items = [];
        state.videos.status = "loading";
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.items = action.payload.videos;
        state.videos.status = "loaded";
      })
      .addCase(fetchVideos.rejected, (state) => {
        state.videos.items = [];
        state.videos.status = "error";
      });
  },
});

export const { resetVideos } = videoSlice.actions;
export const videosReducer = videoSlice.reducer;
