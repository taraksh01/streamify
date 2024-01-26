import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
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

export { createVideoComment };
