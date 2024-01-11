import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

  const usernameExist = await User.findOne({ username });
  if (usernameExist) {
    throw new ApiError(409, "username not available");
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new ApiError(409, "email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0].path;
  const coverImageLocalPath = req.files?.coverImage[0].path;

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  const user = await User.create({
    username: username.toLowerCase(),
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal server error");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

export { registerUser };
