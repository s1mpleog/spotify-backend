import { Response } from "express";
import { IUserDocument } from "../models/user.model";
import { ICookieOptions } from "../types/types";

export const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES as string
);
export const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES as string
);

export const accessTokenOptions: ICookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() * 60 * 60 * 1000),
  secure: process.env.NODE_ENV !== "development",
  sameSite: "lax",
  maxAge: accessTokenExpires * 60 * 60 * 1000,
};

export const refreshTokenOptions: ICookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV !== "development",
  expires: new Date(Date.now() * 3 * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 60 * 60 * 1000,
};

const sendToken = async (user: IUserDocument, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  user.refreshToken = refreshToken;

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(200).json({
    success: true,
    accessToken,
  });
};

export default sendToken;
