import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { getLikedSongs, likeSong } from "../controllers/likedSongs.controller";

const router = Router();

router.use(verifyJWT);

router.route("/new/:songId").post(likeSong);
router.route("/all").get(getLikedSongs);

export default router;
