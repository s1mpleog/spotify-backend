import { Request, Response, NextFunction } from "express";
import { IUserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user: IUserDocument;
    }
  }
}

export type IControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type IUserRegisterBody = {
  username: string;
  email: string;
  password: string;
  fullName: string;
};

export type IUserLoginBody = {
  email: string;
  password: string;
};

export type ICookieOptions = {
  secure?: boolean;
  httpOnly: boolean;
  maxAge: number;
  sameSite: "lax" | "strict" | "none" | undefined;
  expires: Date;
};

export type IArtistRegisterBody = {
  name: string;
  bio: string;
  age: string;
  country: string;
  gender: "male" | "female";
  genre:
    | "Rock"
    | "Pop"
    | "Jazz"
    | "Hip-Hop"
    | "Country"
    | "Electronic"
    | "Classical"
    | string;
};

export type ISongRequestBody = {
  title: string;
  description: string;
  artistId: string;
  releaseDate: string;
};

export type IPlaylistRequestBody = {
  name: string;
  description: string;
  songId: string;
};
