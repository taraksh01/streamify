import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  cteatePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(cteatePlaylist);
router.route("/:playlistId").patch(updatePlaylist);

export default router;
