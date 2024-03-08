import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import { createSong } from "../controllers/song.controller";

const router = Router();

router.use(verifyJWT);

router.route("/create").post(
  upload.fields([
    {
      name: "poster",
      maxCount: 1,
    },
    {
      name: "song",
      maxCount: 1,
    },
  ]),
  createSong
);

export default router;
