import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannelList } from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getSubscribedChannelList);

export default router;
