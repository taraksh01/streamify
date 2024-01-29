import mongoose from "mongoose";

const subscriptionModel = new mongoose.Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", subscriptionModel);
