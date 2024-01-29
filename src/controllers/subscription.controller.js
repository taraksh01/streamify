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
  const subscriberList = await User.aggregate([
    { $match: { _id: req.params.id } },
    {
      $lookup: {
        from: "users",
        localField: "subscribedTo",
        foreignField: "_id",
        as: "subscribedTo",
      },
    },
    {
      $project: {
        fullName: { $arrayElemAt: ["$subscribedTo.fullName", 0] },
        username: { $arrayElemAt: ["$subscribedTo.username", 0] },
        profilePicture: { $arrayElemAt: ["$subscribedTo.avatar", 0] },
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
});

export { getSubscribedChannelList, getSubscribersList };
