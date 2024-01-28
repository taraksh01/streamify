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

export { getSubscribedChannelList };
