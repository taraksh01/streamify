import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

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

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) throw new ApiError(404, "Video not found");

  res
    .status(200)
    .json(new ApiResponse(200, "Video fetched successfully", video));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const userId = await User.findOne({ username }).select("_id");

  if (!userId) {
    throw new ApiError(404, "User not found");
  }

  const videos = await Video.find({ owner: userId });

  res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully", videos));
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) throw new ApiError(404, "Video not found");

  if (String(req.user?._id) !== String(video?.owner)) {
    throw new ApiError(400, "You can't update this video");
  }

  const { title, description } = req.body;

  const updatedVideo = await Video.findByIdAndUpdate(
    id,
    { $set: { title, description } },
    {
      new: true,
    },
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Title and description updated successfully",
        updatedVideo,
      ),
    );
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const thumbnailLocalPath = req.file.path;

  if (!thumbnailLocalPath) throw new ApiError(400, "Please upload thumbnail");

  const video = await Video.findById(req.params.id);

  if (!video) throw new ApiError(404, "Video not found");

  if (String(req.user?._id) !== String(video?.owner)) {
    throw new ApiError(400, "You can't update this video");
  }

  const publicId = video.thumbnail.split("/")[7].split(".")[0];

  const thumbnailCloudinary = await uploadOnCloudinary(thumbnailLocalPath);
  await deleteOnCloudinary(publicId);

  video.thumbnail = thumbnailCloudinary.url;
  video.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Thumbnail updated successfully", video));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params?.id);

  if (!video) throw new ApiError(404, "Video not found");

  if (String(req.user?._id) !== String(video?.owner)) {
    throw new ApiError(400, "You can't delete this video");
  }

  const videoPublicId = video.video.split("/")[7].split(".")[0];
  const thumbnailPublicId = video.thumbnail.split("/")[7].split(".")[0];

  await deleteOnCloudinary(videoPublicId, "video");
  await deleteOnCloudinary(thumbnailPublicId);

  await Video.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, "Video deleted successfully"));
});

const togglePublish = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params?.id);

  if (!video) throw new ApiError(404, "Video not found");

  if (String(req.user?._id) !== String(video?.owner)) {
    throw new ApiError(400, "You can't update this video");
  }

  video.isPublished = !video.isPublished;
  video.save();

  res.status(200).json(new ApiResponse(200, "Video status updated", video));
});

export {
  publishVideo,
  getVideo,
  getAllVideos,
  updateVideoDetails,
  updateThumbnail,
  deleteVideo,
  togglePublish,
};
