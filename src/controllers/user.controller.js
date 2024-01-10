import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";

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

  const { username, fullName, email, password } = req.body;
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[gmail,protommail,outlook]+(?:\.[a-zA-Z0-9-]+)*$/g;
  if (username.trim().length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  } else if (!email.match(regex)) {
    throw new ApiError(400, "Email is not valid");
  } else if (fullName.trim().length < 3) {
    throw new ApiError(400, "Full name must be at least 3 characters long");
  } else if (password.trim().length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const usernameExist = User.findOne({ username });
  if (usernameExist) {
    throw new ApiError(409, "username not available");
  }
  const emailExist = User.findOne({ email });
  if (emailExist) {
    throw new ApiError(409, "email already exists");
  }
});

export { registerUser };
