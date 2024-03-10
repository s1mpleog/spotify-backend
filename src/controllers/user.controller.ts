import userModel from "../models/user.model";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../services/cloudinary";
import { IUserLoginBody, IUserRegisterBody } from "../types/types";
import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import sendToken from "../utils/sendToken";
import isValidId from "../utils/isValidId";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { username, fullName, email, password } = req.body as IUserRegisterBody;

  if (
    [username, email, fullName, password].some((field) => field.trim() === "")
  ) {
    return next(new ErrorHandler("Invalid fields", 400));
  }

  const isUserExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const localPath = req.file?.path;

  if (!localPath) {
    return next(new ErrorHandler("please upload avatar", 400));
  }

  const avatar = await uploadOnCloudinary(localPath, "idk");

  if (!avatar.secure_url) {
    return next(new ErrorHandler("Avatar is required", 400));
  }

  const user = await userModel.create({
    username,
    email,
    password,
    fullName,
    avatar: {
      url: avatar.secure_url,
      public_id: avatar.public_id,
    },
  });

  const loggedInUser = await userModel.findById(user._id);

  if (!loggedInUser) {
    return next(new ErrorHandler("Failed to register a user", 500));
  }

  res.status(201).json({
    message: "User created success",
    loggedInUser,
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body as IUserLoginBody;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide all fields", 400));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid Password", 400));
  }

  sendToken(user, res);
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.status(200).json({
    success: true,
    message: "user logged out success",
  });
});

export const updateTokens = asyncHandler(async (req, res, next) => {
  const user = req.user;

  sendToken(user, res);
});

export const getCurrentLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    user,
  });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const validId = isValidId(userId);

  if (!validId) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { fullName, username } = req.body as IUserRegisterBody;

  const validId = isValidId(userId);

  if (!validId) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  if (!username && !fullName) {
    return next(new ErrorHandler("Please provide username or fullName", 400));
  }

  const user = await userModel.findOne({ username, _id: { $ne: userId } });

  if (user) {
    return next(new ErrorHandler("username is taken", 400));
  }

  const updateUser = await userModel.findById(userId);

  if (!updateUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (username && username !== updateUser.username) {
    updateUser.username = username;
  }

  if (fullName && fullName !== updateUser.fullName) {
    updateUser.fullName = fullName;
  }

  await updateUser.save();

  res.status(200).json({
    success: true,
    message: "user updated success",
  });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const validId = isValidId(userId);

  if (!validId) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "user deleted success",
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { password, newPassword } = req.body;

  if (!password && !newPassword) {
    return next(new ErrorHandler("Please provide new password", 400));
  }

  const validId = isValidId(userId);

  if (!validId) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  const user = await userModel.findById(userId).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isPassowrdMatches = await user.isPasswordCorrect(password);

  if (!isPassowrdMatches) {
    return next(new ErrorHandler("Old password is not valid", 401));
  }

  user.password = newPassword;

  await user.save();

  res.status(201).json({
    success: true,
    message: "Your password has been successfully updated.",
  });
});

export const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await userModel.findById(userId);

  const localPath = req.file?.path;

  if (!localPath) {
    return next(new ErrorHandler("New image in required", 400));
  }

  await deleteFromCloudinary(user?.avatar.public_id as string);

  const newImage = await uploadOnCloudinary(localPath, "idk");

  if (!newImage.secure_url) {
    return next(new ErrorHandler("Failed to update avatar", 500));
  }

  const img = {
    url: newImage.secure_url,
    public_id: newImage.public_id,
  };

  user!.avatar = img;

  await user?.save();

  res.status(200).json({
    success: true,
    message: "Your avatar has been successfully updated.",
  });
});
