import artistModel from "../models/artist.model";
import songModel from "../models/song.model";
import { uploadOnCloudinary } from "../services/cloudinary";
import { ISongRequestBody } from "../types/types";
import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import formatDuration from "../utils/formatDuration";
import isValidId from "../utils/isValidId";

export const createSong = asyncHandler(async (req, res, next) => {
  const { artistId, description, title, releaseDate } =
    req.body as ISongRequestBody;

  if (
    [artistId, description, title, releaseDate].some(
      (field) => field.trim() === ""
    )
  ) {
    return next(new ErrorHandler("Invalid fields", 400));
  }

  const isValid = isValidId(artistId);

  if (!isValid) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  const artist = await artistModel.findById(artistId);

  if (!artist) {
    return next(new ErrorHandler("Artist not found", 404));
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const posterLocalPath = files["poster"][0].path;
  const songLocalPath = files["song"][0].path;

  if (!posterLocalPath && !songLocalPath) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const poster = await uploadOnCloudinary(posterLocalPath, "poster");
  const songUrl = await uploadOnCloudinary(songLocalPath, "songs");

  const songDuration = songUrl.duration;
  const formattedDuration = formatDuration(songDuration);

  const newSong = await songModel.create({
    title,
    release_date: Number(releaseDate),
    description,
    total_length: formattedDuration,
    artist: artistId,
    poster: {
      url: poster.secure_url,
      public_id: poster.public_id,
    },
    file: {
      url: songUrl.secure_url,
      public_id: songUrl.public_id,
    },
  });

  await artistModel.findByIdAndUpdate(
    artistId,
    { $addToSet: { songs: newSong._id } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: `${title} added`,
  });
});

export const getAllSongs = asyncHandler(async (req, res, next) => {
  const songs = await songModel.find({});

  res.status(200).json({
    success: true,
    songs,
  });
});

export const getSongById = asyncHandler(async (req, res, next) => {
  const { songId } = req.params;

  const validId = isValidId(songId);

  if (!validId) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  const song = await songModel.findById(songId);

  if (!song) {
    return next(new ErrorHandler("Song not found", 404));
  }

  res.status(200).json({
    success: true,
    song,
  });
});

export const deleteSong = asyncHandler(async (req, res, next) => {
  const { songId } = req.params;

  const validId = isValidId(songId);

  if (!validId) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  const song = await songModel.findById(songId);

  if (!song) {
    return next(new ErrorHandler("Song not found", 404));
  }

  await song.deleteOne();

  res.status(200).json({
    success: true,
    message: "Song deleted successfully",
  });
});

export const updateSong = asyncHandler(async (req, res, next) => {
  const { songId } = req.params;

  const { title, description } = req.body as ISongRequestBody;

  const validId = isValidId(songId);

  if (!validId) {
    return next(new ErrorHandler("Invalid Id", 400));
  }

  const song = await songModel.findById(songId);

  if (!song) {
    return next(new ErrorHandler("Song not found", 404));
  }

  if (title && title !== song.title) {
    song.title = title;
  }

  if (description && description !== song.title) {
    song.description = description;
  }
});
