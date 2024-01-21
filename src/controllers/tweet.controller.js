import { asyncHandler } from "../utils/asyncHandler";
import { Tweet } from "../models/Tweet";
import { ApiError } from "../utils/ApiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (content.trim().length === 0) {
    throw new ApiError(400, "Tweet cannot be empty");
  }

  const imageLocalPath = req.file?.path;
  const imageCloudinaryUrl = await uploadOnCloudinary(imageLocalPath);

  const tweet = await Tweet.create({
    content: content.trim(),
    author: req.user._id,
    image: imageCloudinaryUrl.url,
  });

  if (!tweet) {
    throw new ApiError(500, "Something went wrong while creating tweet");
  }

  return res.status(201).json(new ApiResponse(200, "Tweet created", tweet));
});

export { createTweet };
