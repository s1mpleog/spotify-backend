import likedSongsModel from "../models/likedSongs.model";
import songModel from "../models/song.model";
import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import isValidId from "../utils/isValidId";

export const likeSong = asyncHandler(async (req, res, next) => {
  const { songId } = req.params;

  const validId = isValidId(songId);

  if (!validId) {
    return next(new ErrorHandler("Invalid Song Id", 400));
  }

  const song = await songModel.findById(songId);

  if (!song) {
    return next(new ErrorHandler("Song not found", 404));
  }

  const isLiked = await likedSongsModel.findOne({
    user: req.user._id,
    songs: songId,
  });

  if (isLiked) {
    await likedSongsModel.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { songs: songId } }
    );

    return res
      .status(200)
      .json({ message: `${song.title} disliked successfully` });
  }

  await likedSongsModel.findOneAndUpdate(
    { user: req.user._id },
    { $addToSet: { songs: songId } },
    { upsert: true }
  );

  res.status(200).json({
    success: true,
    message: `${song.title} liked successfully`,
  });
});

export const getLikedSongs = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const likedSongs = await likedSongsModel
    .find({
      user: _id,
    })
    .populate("songs");

  if (!likedSongs) {
    return next(new ErrorHandler("Failed to fetch liked songs", 400));
  }

  res.status(200).json({
    success: true,
    likedSongs,
  });
});
