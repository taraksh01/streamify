import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ ValidityState: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

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

  if (username.trim().length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  } else if (!validateEmail(email)) {
    throw new ApiError(400, "Email is not valid");
  } else if (fullName.trim().length < 3) {
    throw new ApiError(400, "Full name must be at least 3 characters long");
  } else if (password.trim().length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  if (await isUsernameAvailable(username)) {
    throw new ApiError(409, "username not available");
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    throw new ApiError(409, "email already exists");
  }

  const avatarLocalPath = req.files?.avatar && req.files?.avatar[0].path;
  const coverImageLocalPath =
    req.files?.coverImage && req.files?.coverImage[0].path;

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

const loginUser = asyncHandler(async (req, res) => {
  // steps to login a user
  // get user details from frontend
  // validate user details
  // check if user exists
  // check if password is correct
  // create access and refresh token
  // send cookies to frontend

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: "" },
    { $set: { refreshToken: undefined } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully", {}));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incommingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or invalid");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
        refreshToken,
      }),
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  user.password = newPassword;
  user.save({ ValidityState: false });

  return res.status(200).json(new ApiResponse(200, "Password changed", {}));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, "User fetched successfully", user));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { username, fullName, email } = req.body;

  if (!validateEmail(email)) {
    throw new ApiError(400, "Email is not valid");
  }
  if (username.trim().length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters long");
  } else if (username !== req.user.username) {
    if (await isUsernameAvailable(username)) {
      throw new ApiError(400, "Username is not available");
    }
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { username, fullName, email },
    },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "User details updated successfully", user));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatar.url } },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", user));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(500, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { coverImage: coverImage.url } },
    { new: true },
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Cover image updated successfully", user));
});

const getChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.trim().toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribedTo",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        subscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        subscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Channel fetched", channel[0]));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "Watch history fetched", user[0].watchHistory));
});

const validateEmail = (email) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[gmail,protommail,outlook]+(?:\.[a-zA-Z0-9-]+)*$/g;

  return email.match(regex);
};

const isUsernameAvailable = async (username) => {
  const usernameExist = await User.findOne({ username });

  return usernameExist !== null;
};

const getUser = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User details fetched successfully", user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile,
  getWatchHistory,
  isUsernameAvailable,
  getUser,
};
