import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  createSong,
  deleteSong,
  getAllSongs,
  getSongById,
  updateSong,
} from "../controllers/song.controller";

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

router.route("/by-id/:songId").get(getSongById);
router.route("/delete/:songId").delete(deleteSong);
router.route("/all").get(getAllSongs);
router.route("/update/:songId").patch(updateSong);

export default router;
