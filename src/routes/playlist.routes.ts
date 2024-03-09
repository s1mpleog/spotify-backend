import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import {
  createPlaylist,
  getPlaylist,
  showPlaylist,
} from "../controllers/playlist.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/new").post(upload.single("poster"), createPlaylist);
router.route("/all").get(getPlaylist);
router.route("/show/:playlistId").get(showPlaylist);

export default router;
