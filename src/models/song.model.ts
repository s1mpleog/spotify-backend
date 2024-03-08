import mongoose, { Document, Model } from "mongoose";

export interface ISongType extends Document {
  title: string;
  poster: {
    url: string;
    public_id: string;
  };
  total_length: string;
  description: string;
  file: {
    url: string;
    public_id: string;
  };
  release_date: string;
  artist: mongoose.Schema.Types.ObjectId;
}

const songSchema = new mongoose.Schema<ISongType>({
  title: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  total_length: {
    type: String,
    required: true,
  },
  release_date: {
    type: String,
    required: true,
  },
  file: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  poster: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
  },
});

const songModel: Model<ISongType> = mongoose.model("Song", songSchema);
export default songModel;
