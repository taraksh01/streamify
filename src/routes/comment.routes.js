import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweetComment,
  createVideoComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:id").post(createVideoComment);
router.route("/tweet/:id").post(createTweetComment);

export default router;
