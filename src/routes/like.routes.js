import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").patch(toggleVideoLike);
router.route("/comment/:commentId").patch(toggleCommentLike);
router.route("/tweet/:tweetId").patch(toggleTweetLike);

router.route("/videos").get(getLikedVideos);

export default router;
