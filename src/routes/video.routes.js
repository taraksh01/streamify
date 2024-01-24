import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideo, publishVideo } from "../controllers/video.controller.js";
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

router.route("/:id").get(getVideo);

export default router;
