import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  const { videoFile, thumbnailFile } = req.files;

  if (!title.trim().length === 0)
    throw new ApiError(400, "Please provide title for video");

  if (!description.trim().length === 0)
    throw new ApiError(400, "Please provide description for video");

  if (!videoFile || !thumbnailFile)
    throw new ApiError(400, "Please upload video and thumbnail");

  const videoLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnailFile[0].path;

  const videoCloudinary = await uploadOnCloudinary(videoLocalPath);
  const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);

  const video = await Video.create({
    title,
    description,
    isPublished: isPublished || false,
    video: videoCloudinary.url,
    thumbnail: thumbnailCloudinary.url,
    duration: videoCloudinary.duration,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(200, "Video uploaded successfully", video));
});

export { publishVideo };
