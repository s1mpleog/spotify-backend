import mongoose, { Document, Model } from "mongoose";

interface IWatchedSongs extends Document {
  user: mongoose.Schema.Types.ObjectId;
  songs: mongoose.Schema.Types.ObjectId[];
}

const watchedSongsSchema = new mongoose.Schema<IWatchedSongs>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: true,
    },
  ],
});

const watchedSongsModel: Model<IWatchedSongs> = mongoose.model(
  "WatchedSongs",
  watchedSongsSchema
);
export default watchedSongsModel;
