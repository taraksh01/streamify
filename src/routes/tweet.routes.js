import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweet,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:username").get(verifyJWT, getAllTweets);
router.route("/create").post(verifyJWT, upload.single("image"), createTweet);
router.route("/get/:id").get(getTweet);
router.route("/update/:id").patch(verifyJWT, updateTweet);
router.route("/delete/:id").delete(verifyJWT, deleteTweet);

export default router;
