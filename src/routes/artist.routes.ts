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
router.use(verifyJWT);

router.route("/create").post(upload.single("avatar"), createArtist);
router.route("/by-id/:artistId").get(getArtistById);
router.route("/all").get(getAllArtist);
router.route("/delete/:artistId").delete(deleteArtist);
router.route("/update/:artistId").patch(updateArtist);
router
  .route("/update-avatar/:artistId")
  .patch(upload.single("avatar"), updateArtistAvatar);

export default router;
