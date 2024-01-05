import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 80,
      index: true,
    },
    video: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 2000 },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], required: true },
    isPublished: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
