import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import videoRoutes from "./routes/videoRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

dotenv.config();
const app = express();
app.use(json());
app.use(cors());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database OK"))
  .catch((err) => {
    console.error("Database connection error:", err);
  });

app.use("/auth", authRoutes);
app.use("/videos", videoRoutes);
app.use("/users", userRoutes);
app.use("/comment", commentRoutes);
app.use("/playlists", playlistRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoriesRoutes);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log(err);
  } else {
    console.log(process.env.PORT);
    console.log("Server OK");
  }
});
