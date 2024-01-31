import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
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

export default router;
