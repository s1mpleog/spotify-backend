import playlistModel from "../models/playlist.model";
import songModel from "../models/song.model";
import { uploadOnCloudinary } from "../services/cloudinary";
import { IPlaylistRequestBody } from "../types/types";
import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import isValidId from "../utils/isValidId";

export const createPlaylist = asyncHandler(async (req, res, next) => {
  const { name, description, songId } = req.body as IPlaylistRequestBody;

  if (!name || !songId) {
    return next(new ErrorHandler("Name fields are required", 400));
  }

  const validId = isValidId(songId);

  const user = req.user;

  if (!validId) {
    return next(new ErrorHandler("Invalid song Id", 400));
  }

  const song = await songModel.findById(songId);

  const isSongAlreadyExists = await playlistModel.findOne({
    songs: songId,
    owner: user._id,
  });

  if (!song) {
    return next(new ErrorHandler("Song not found", 404));
  }

  if (isSongAlreadyExists) {
    return res.status(409).json({
      message: `${song.title} already exists`,
    });
  }

  const playlist = new playlistModel({
    name,
    owner: user._id,
    songs: [songId],
  });

  const posterLocalPath = req.file?.path;

  if (posterLocalPath) {
    const poster = await uploadOnCloudinary(posterLocalPath, "playlist-poster");

    if (!poster.secure_url) {
      return next(new ErrorHandler("Failed to upload playlist poster", 500));
    }

    const newImg = {
      url: poster.secure_url,
      public_id: poster.public_id,
    };

    playlist.poster = newImg;
  }

  if (description) {
    playlist.description = description;
  }

  await playlist.save();

  res.status(201).json({
    success: true,
    message: `${playlist.name} created success.`,
  });
});

export const getPlaylist = asyncHandler(async (req, res, next) => {
  const playlist = await playlistModel.find({
    owner: req.user._id,
  });

  res.status(200).json({
    playlist,
  });
});

export const showPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const validId = isValidId(playlistId);

  if (!validId) {
    return next(new ErrorHandler("Invalid playlist Id", 400));
  }

  const playlist = await playlistModel.findById(playlistId).populate("songs");

  if (!playlist) {
    return next(new ErrorHandler("Oops Playlist Not found", 404));
  }

  res.status(200).json({
    playlist,
  });
});

export const deletePlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.params;

  const validId = isValidId(playlistId);

  if (!validId) {
    return next(new ErrorHandler("Invalid playlist Id", 400));
  }

  await playlistModel.findByIdAndDelete(playlistId);

  res.status(200).json({
    success: true,
    message: "Playlist delted successfully.",
  });
});
