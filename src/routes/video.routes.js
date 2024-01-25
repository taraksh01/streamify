import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideo,
  publishVideo,
  togglePublish,
  updateThumbnail,
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
router.route("/update/video-details/:id").patch(updateVideoDetails);
router
  .route("/update/thumbnail/:id")
  .patch(upload.single("thumbnail"), updateThumbnail);
router.route("/update/:id").delete(deleteVideo);
router.route("/update/status/:id").patch(togglePublish);

export default router;
