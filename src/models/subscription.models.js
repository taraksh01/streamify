import mongoose from "mongoose";

const subscriptionModel = new mongoose.Schema(
  {
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subscribedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected", "banned", "suspended"],
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionModel);
