import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  createArtist,
  deleteArtist,
  getAllArtist,
  getArtistById,
  updateArtist,
  updateArtistAvatar,
} from "../controllers/artist.controller";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("avatar"), createArtist);
router.route("/by-id/:artistId").get(getArtistById);
router.route("/all").get(getAllArtist);
router.route("/delete/:artistId").delete(verifyJWT, deleteArtist);
router.route("/update/:artistId").patch(verifyJWT, updateArtist);
router
  .route("/update-avatar/:artistId")
  .patch(verifyJWT, upload.single("avatar"), updateArtistAvatar);

export default router;
