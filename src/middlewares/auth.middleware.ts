import userModel from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import ErrorHandler from "../utils/errorHandler";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies["access_token"];

  if (!accessToken) {
    return next(new ErrorHandler("Unauthorized request", 401));
  }

  const decodedToken = jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as Secret
  ) as JwtPayload;

  if (!decodedToken.id) {
    return next(new ErrorHandler("Invalid Token", 401));
  }

  const user = await userModel.findById(decodedToken.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});

export default verifyJWT;
