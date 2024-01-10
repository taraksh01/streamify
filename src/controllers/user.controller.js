import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  // steps to register a user
  // get user details from frontend
  // validate user details
  // check if user already exists
  // upload images to cloudinary
  // create user object and create entry in db
  // remove password and refresh token from response
  // check if user created successfully
  // send response back to user on frontend
});

export { registerUser };
