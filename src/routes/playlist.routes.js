import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  cteatePlaylist,
  deletePlaylist,
  getPlaylist,
  getUserPlaylist,
  removeVideoFromPlaylist,
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
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);
router.route("/user/:userId").get(getUserPlaylist);

export default router;
