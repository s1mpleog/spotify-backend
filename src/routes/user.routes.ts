import { Router } from "express";
import {
  changePassword,
  deleteAccount,
  getCurrentLoggedInUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  updateTokens,
  updateUserAvatar,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(verifyJWT, getCurrentLoggedInUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update").post(verifyJWT, updateTokens);
router.route("/profile/:userId").get(verifyJWT, getUserProfile);
router.route("/profile/update/:userId").patch(verifyJWT, updateProfile);
router.route("/profile/delete/:userId").delete(verifyJWT, deleteAccount);
router
  .route("/profile/update-password/:userId")
  .patch(verifyJWT, changePassword);
router
  .route("/profile/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;
