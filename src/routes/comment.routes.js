import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweetComment,
  createVideoComment,
  getAllCommentsOnTweet,
  getAllCommentsOnVideo,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:id").get(getAllCommentsOnVideo).post(createVideoComment);
router.route("/tweet/:id").get(getAllCommentsOnTweet).post(createTweetComment);

export default router;
