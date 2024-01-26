import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createVideoComment } from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:id").post(createVideoComment);

export default router;
