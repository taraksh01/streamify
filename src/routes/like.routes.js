import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").patch(toggleVideoLike);
router.route("/comment/:commentId").patch(toggleCommentLike);

export default router;
