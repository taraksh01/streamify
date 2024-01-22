import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

const getTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const tweet = await Tweet.findById(id);

    if (!tweet) {
      console.log("Tweet not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet fetched sucsessfully", tweet));
  } catch (error) {
    return res.status(400).json(new ApiError(400, error.message));
  }
});

export { createTweet, getTweet };
