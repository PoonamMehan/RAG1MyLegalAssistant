import {Router} from "express";
import { generateAnswer, getMsgHistory } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/generate-answer").post(verifyJWT, generateAnswer)
router.route("/get-message-history").post(verifyJWT, getMsgHistory)

export default router;