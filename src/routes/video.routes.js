import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllVideos,
  getVideo,
  publishVideo,
  updateVideoDetails,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
  ]),
  publishVideo,
);
router.route("/:username").get(getAllVideos);
router.route("/watch/:id").get(getVideo);

export default router;
