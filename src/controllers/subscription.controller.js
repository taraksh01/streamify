import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const getSubscribedChannelList = asyncHandler(async (req, res) => {
  try {
    const channelList = await Subscription.aggregate([
      {
        $match: { subscriber: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscribedTo",
          foreignField: "_id",
          as: "channel",
          pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
        },
      },
      {
        $addFields: {
          channel: { $first: "$channel" },
        },
      },
      {
        $project: {
          channel: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Subscribed channels list fetched successfully",
          channelList,
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const getSubscribersList = asyncHandler(async (req, res) => {
  try {
    const subscriberList = await Subscription.aggregate([
      { $match: { subscribedTo: new mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
          pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
        },
      },
      {
        $addFields: {
          subscriber: { $first: "$subscriber" },
        },
      },
      {
        $project: {
          subscriber: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Subscribers list fetched successfully",
          subscriberList,
        ),
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

const toggleSubscribe = asyncHandler(async (req, res) => {
  const { subscribedTo } = req.body;

  const user = await User.findById(subscribedTo);

  if (!user) {
    throw new ApiError("Channel not found");
  }

  const isSubscribed = await Subscription.find({
    subscriber: req.user.id,
    subscribedTo,
  });

  if (isSubscribed.length === 0) {
    await Subscription.create({
      subscriber: req.user.id,
      subscribedTo,
    });
  } else {
    await Subscription.deleteOne({
      subscribedTo,
      subscriber: req.user.id,
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Subscription updated successfully"));
});

export { getSubscribedChannelList, getSubscribersList, toggleSubscribe };
