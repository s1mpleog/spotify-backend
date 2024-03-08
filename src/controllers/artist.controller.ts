import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import artistModel from "../models/artist.model";
import { IArtistRegisterBody } from "../types/types";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../services/cloudinary";
import isValidId from "../utils/isValidId";

export const createArtist = asyncHandler(async (req, res, next) => {
  const { name, age, bio, gender, genre, country } =
    req.body as IArtistRegisterBody;

  if (
    [name, age, gender, genre, country].some((field) => field.trim() === "")
  ) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const localPath = req.file?.path;

  if (!localPath) {
    return next(new ErrorHandler("Avatar is required", 400));
  }

  const avatar = await uploadOnCloudinary(localPath, "artist");

  if (!avatar.secure_url) {
    return next(new ErrorHandler("Error while uploading avatar", 400));
  }

  await artistModel.create({
    name,
    age: Number(age),
    bio: bio || "",
    gender,
    genre,
    country,
    avatar: {
      url: avatar.secure_url,
      public_id: avatar.public_id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Artist created success.",
  });
});

export const getArtistById = asyncHandler(async (req, res, next) => {
  const { artistId } = req.params;

  const checkId = isValidId(artistId);

  if (!checkId) {
    return next(new ErrorHandler("Invalid Actor Id", 400));
  }

  const artist = await artistModel.findById(artistId);

  if (!artist) {
    return next(new ErrorHandler("Artist not found", 404));
  }

  res.status(200).json({
    success: true,
    artist,
  });
});

export const getAllArtist = asyncHandler(async (req, res, next) => {
  const artist = await artistModel.find({});

  res.status(200).json({
    success: true,
    artist,
  });
});

export const deleteArtist = asyncHandler(async (req, res, next) => {
  const { artistId } = req.params;

  const checkId = isValidId(artistId);

  if (!checkId) {
    return next(new ErrorHandler("Invalid Actor Id", 400));
  }

  const artist = await artistModel.findById(artistId);

  if (!artist) {
    return next(new ErrorHandler("Artist not found", 404));
  }

  await artist.deleteOne();

  res.status(200).json({
    success: true,
    message: "Artist deleted success.",
  });
});

export const updateArtist = asyncHandler(async (req, res, next) => {
  const { artistId } = req.params;
  const { age, bio, country, name, genre } = req.body as IArtistRegisterBody;

  const checkId = isValidId(artistId);

  if (!checkId) {
    return next(new ErrorHandler("Invalid Actor Id", 400));
  }

  const numberAge = Number(age);

  const artist = await artistModel.findById(artistId);

  if (!artist) {
    return next(new ErrorHandler("Artist not found", 404));
  }

  if (numberAge && numberAge !== artist.age) {
    artist.age = numberAge;
  }

  if (name && name !== artist.name) {
    artist.name = name;
  }

  if (bio && bio !== artist.bio) {
    artist.bio = bio;
  }

  if (country && country !== artist.country) {
    artist.country = country;
  }

  if (genre && genre !== artist.genre) {
    artist.genre = genre;
  }

  await artist.save();

  res.status(200).json({
    success: true,
    message: "Artist updated successfully.",
  });
});

export const updateArtistAvatar = asyncHandler(async (req, res, next) => {
  const { artistId } = req.params;

  const checkId = isValidId(artistId);

  if (!checkId) {
    return next(new ErrorHandler("Invalid Actor Id", 400));
  }

  const artist = await artistModel.findById(artistId);

  if (!artist) {
    return next(new ErrorHandler("Artist not found", 404));
  }

  const localPath = req.file?.path;

  if (!localPath) {
    return next(new ErrorHandler("New Avatar is required", 400));
  }

  await deleteFromCloudinary(artist.avatar.public_id);

  const newAvatar = await uploadOnCloudinary(localPath, "artist");

  if (!newAvatar.secure_url) {
    return next(new ErrorHandler("Failed to upload avatar", 500));
  }

  const img = {
    url: newAvatar.secure_url,
    public_id: newAvatar.public_id,
  };

  artist.avatar = img;

  await artist.save();

  res.status(200).json({
    success: true,
    message: `${artist.name} avatar updated successfully.`,
  });
});
