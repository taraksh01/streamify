import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const healthCheck = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(new ApiResponse(200, "Server is running properly"));
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error.message);
  }
});

export { healthCheck };
