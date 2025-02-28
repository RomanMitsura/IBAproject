import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Video from "./Video.js";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "guest", "user"],
      default: "user",
    },
    avatarUrl: {
      type: String,
      default: "/uploads/avatar-basic.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this._conditions._id;

  try {
    const videos = await Video.find({ user: userId });

    for (const video of videos) {
      if (video.videoUrl) {
        const videoPath = path.join(process.cwd(), video.videoUrl);
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }
      if (video.videoImageUrl) {
        const imagePath = path.join(process.cwd(), video.videoImageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await Video.deleteMany({ user: userId });

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
export default User;
