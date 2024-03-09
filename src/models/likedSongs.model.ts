import mongoose, { Document, Model } from "mongoose";

interface ILikedSongs extends Document {
  user: mongoose.Schema.Types.ObjectId;
  songs: mongoose.Schema.Types.ObjectId[];
}

const likedSongsSchema = new mongoose.Schema<ILikedSongs>(
  {
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
        unique: true,
      },
    ],
  },
  { timestamps: true }
);

const likedSongsModel: Model<ILikedSongs> = mongoose.model(
  "LikedSongs",
  likedSongsSchema
);
export default likedSongsModel;
