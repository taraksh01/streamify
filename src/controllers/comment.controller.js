import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { Comment } from "../models/comment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createVideoComment = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) throw new ApiError(404, "Video not found");

  const { content } = req.body;

  if (!content) throw new ApiError(400, "Comment is required");

  const comment = await Comment.create({
    content,
    author: req.user._id,
    video: video._id,
  });

  if (!comment) throw new ApiError(500, "Server error while creating comment");

  res
    .status(201)
    .json(new ApiResponse(200, "Comment created successfully", comment));
});

const createTweetComment = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) throw new ApiError(404, "Tweet not found");

  const { content } = req.body;

  if (!content) throw new ApiError(400, "Comment is required");

  const comment = await Comment.create({
    content,
    author: req.user._id,
    tweet: tweet._id,
  });

  if (!comment) throw new ApiError(500, "Server error while creating comment");

  res
    .status(201)
    .json(new ApiResponse(200, "Comment created successfully", comment));
});

const getAllCommentsOnVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) throw new ApiError(404, "Video not found");

  const comments = await Comment.aggregate([
    { $match: { video: video._id } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        username: { $arrayElemAt: ["$author.username", 0] },
        fullName: { $arrayElemAt: ["$author.fullName", 0] },
        profilePicture: { $arrayElemAt: ["$author.avatar", 0] },
        video: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});

const getAllCommentsOnTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) throw new ApiError(404, "Tweet not found");

  const comments = await Comment.aggregate([
    { $match: { tweet: tweet._id } },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    {
      $project: {
        username: { $arrayElemAt: ["$author.username", 0] },
        fullName: { $arrayElemAt: ["$author.fullName", 0] },
        profilePicture: { $arrayElemAt: ["$author.avatar", 0] },
        tweet: 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, "Comments fetched successfully", comments));
});

const getComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) throw new ApiError(404, "Comment not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Comment fetched successfully", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.author.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to update this comment");

  const { content } = req.body;

  if (!content) throw new ApiError(400, "Comment is required");

  comment.content = content;
  comment.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Comment updated successfully", comment));
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.author.toString() !== req.user._id.toString())
    throw new ApiError(403, "You are not authorized to delete this comment");

  await comment.deleteOne({
    _id: req.params.id,
  });

  res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

export {
  createVideoComment,
  createTweetComment,
  getAllCommentsOnVideo,
  getAllCommentsOnTweet,
  getComment,
  updateComment,
  deleteComment,
};
