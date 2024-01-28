import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getSubscribedChannelList = asyncHandler(async (req, res) => {
  const channelList = await User.aggregate([
    { $match: { subscriber: req.user._id } },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
      },
    },
    {
      $project: {
        fullName: { $arrayElemAt: ["$subscriber.fullName", 0] },
        username: { $arrayElemAt: ["$subscriber.username", 0] },
        profilePicture: { $arrayElemAt: ["$subscriber.avatar", 0] },
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
