import { asyncHandler } from "../utils/asyncHandler.js";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const cteatePlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos } = req.body;
  if (!name || !description) {
    throw new ApiError(400, "Please provide name and description");
  }

  if (!videos) {
    throw new ApiError(400, "Please provide atleast one video");
  }

  const playlist = await Playlist.create({
    name,
    description,
    videos: [...new Set(videos)],
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while creating playlist");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "Playlist created successfully", playlist));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Please provide playlist id");
  }

  const playlist = await Playlist.findOne({ _id: playlistId });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this playlist");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate({
    _id: playlistId,
    name,
    description,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Playlist updated successfully", updatedPlaylist),
    );
});

const getPlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    throw new ApiError(400, "Please provide playlist id");
  }

  const playlist = await Playlist.findOne({ _id: playlistId });

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched successfully", playlist));
});

export { cteatePlaylist, updatePlaylist, getPlaylist };
