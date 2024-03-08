import { Request, Response, NextFunction } from "express";
import { IControllerType } from "../types/types";

const asyncHandler =
  (fn: IControllerType) =>
  (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
