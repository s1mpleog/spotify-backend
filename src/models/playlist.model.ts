import mongoose, { Document, Model } from "mongoose";

interface IPlaylist extends Document {
  name: string;
  description: string;

  songs: mongoose.Schema.Types.ObjectId[];
  owner: mongoose.Schema.Types.ObjectId;
  poster: {
    url: string;
    public_id: string;
  };
}

const playlistSchema = new mongoose.Schema<IPlaylist>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  poster: {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const playlistModel: Model<IPlaylist> = mongoose.model(
  "Playlist",
  playlistSchema
);
export default playlistModel;
