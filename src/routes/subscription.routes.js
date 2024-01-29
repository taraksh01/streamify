import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannelList,
  getSubscribersList,
  toggleSubscribe,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getSubscribedChannelList).patch(toggleSubscribe);
router.route("/:id").get(getSubscribersList);

export default router;
