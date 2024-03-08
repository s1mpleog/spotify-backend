import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  avatar: {
    url: string;
    public_id: string;
  };
  fullName: string;
}

export interface IUserDocument extends IUser {
  isPasswordCorrect: (password: string) => Promise<boolean>;
  signAccessToken: () => string;
  signRefreshToken: () => string;
}

const emailReg: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema<IUserDocument>({
  username: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    index: true,
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: function (val: string) {
      return emailReg.test(val);
    },
  },

  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, "Password should be at least 6 characters"],
  },

  avatar: {
    url: {
      type: String,
      required: [true, "Avatar is required"],
    },
    public_id: {
      type: String,
      required: true,
    },
  },

  refreshToken: {
    type: String,
    select: false,
  },
});

userSchema.pre<IUserDocument>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.signAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    }
  );
};

userSchema.methods.signRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    }
  );

  this.refreshToken = refreshToken;
  return refreshToken;
};

const userModel: Model<IUserDocument> = mongoose.model("User", userSchema);
export default userModel;
