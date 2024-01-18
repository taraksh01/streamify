import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true },
);

export const Like = mongoose.model("Like", likeSchema);
