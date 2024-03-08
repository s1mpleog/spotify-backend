import mongoose, { Document, Model } from "mongoose";

export interface IArtist extends Document {
  name: string;
  avatar: {
    url: string;
    public_id: string;
  };
  bio: string;
  age: number;
  country: string;
  genre: string;
  gender: "Male" | "Female";
  songs: Array<mongoose.Schema.Types.ObjectId>;
}

const artistSchema = new mongoose.Schema<IArtist>({
  name: {
    type: String,
    required: true,
    index: true,
  },
  bio: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  gender: {
    enum: ["Male", "Female"],
    type: String,
    required: [true, "Actor gender is required"],
  },
  avatar: {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  ],
});

const artistModel: Model<IArtist> = mongoose.model("Artist", artistSchema);
export default artistModel;
