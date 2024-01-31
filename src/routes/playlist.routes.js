import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cteatePlaylist } from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(cteatePlaylist);

export default router;
