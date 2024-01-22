import { Router } from "express";
import { createTweet, getTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("image"), createTweet);
router.route("/:id").get(getTweet);

export default router;
