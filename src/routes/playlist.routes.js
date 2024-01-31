import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  cteatePlaylist,
  deletePlaylist,
  getPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(cteatePlaylist);
router
  .route("/:playlistId")
  .get(getPlaylist)
  .patch(updatePlaylist)
  .delete(deletePlaylist);
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

export default router;
