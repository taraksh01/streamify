import { Video } from "../models/video.models.js";
import { Like } from "../models/like.models.js";
import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) throw new ApiError(400, "Video id is missing");

  const video = await Video.findOne({ _id: videoId });
  if (!video) throw new ApiError(404, "Video not found");

  const isLiked = await Like.findOne({ video: videoId, likedBy: req.user._id });

  if (isLiked) {
    await Like.deleteOne({ video: videoId, likedBy: req.user._id });
  } else {
    await Like.create({ video: videoId, likedBy: req.user._id });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Like toggled successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!commentId) throw new ApiError(400, "Comment id is missing");

  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) throw new ApiError(404, "Comment not found");

  const isLiked = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id,
  });

  if (isLiked) {
    await Like.deleteOne({ comment: commentId, likedBy: req.user._id });
  } else {
    await Like.create({ comment: commentId, likedBy: req.user._id });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Like toggled successfully"));
});

export { toggleVideoLike, toggleCommentLike };
