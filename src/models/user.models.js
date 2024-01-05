import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, required: true, trim: true },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
      trim: true,
    },
    coverImage: { type: String, trim: true },
    watchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    refreshToken: { type: String, trim: true },
  },

  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) return next();
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("User", userSchema);
