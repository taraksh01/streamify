import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweetComment,
  createVideoComment,
  deleteComment,
  getAllCommentsOnTweet,
  getAllCommentsOnVideo,
  getComment,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:id").get(getAllCommentsOnVideo).post(createVideoComment);
router.route("/tweet/:id").get(getAllCommentsOnTweet).post(createTweetComment);
router.route("/:id").get(getComment).patch(updateComment).delete(deleteComment);

export default router;
