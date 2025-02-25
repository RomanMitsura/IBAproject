// models/Playlist.js
import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // По умолчанию приватный
    },
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model("Playlist", playlistSchema);
export default Playlist;
