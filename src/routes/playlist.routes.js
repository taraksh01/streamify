import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  cteatePlaylist,
  getPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(cteatePlaylist);
router.route("/:playlistId").patch(updatePlaylist).get(getPlaylist);

export default router;
