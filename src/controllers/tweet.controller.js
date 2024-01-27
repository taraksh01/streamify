import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

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

  const tweet = await Tweet.findById(id);

  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet fetched sucsessfully", tweet));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tweet = await Tweet.findById(id);

  if (String(req.user._id) === String(tweet.author)) {
    const { content } = req.body;
    if (content.trim().length === 0) {
      throw new ApiError(400, "Tweet cannot be empty");
    }
    // TODO: handle image or video while updating tweet

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, "Tweet updated", tweet));
  } else {
    throw new ApiError(400, "Not authorized to edit content");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tweet = await Tweet.findById(id);

  if (String(req.user._id) !== String(tweet.author)) {
    throw new ApiError(400, "Not authorized to delete tweet");
  }

  await tweet.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tweets = await Tweet.find({ author: user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, "All tweets fetched successfully", tweets));
});

export { createTweet, getTweet, updateTweet, deleteTweet, getAllTweets };
