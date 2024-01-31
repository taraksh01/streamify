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

export { cteatePlaylist };
