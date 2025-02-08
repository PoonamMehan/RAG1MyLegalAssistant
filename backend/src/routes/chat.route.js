import {Router} from "express";
import { generateAnswer } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/generate-answer").post(verifyJWT, generateAnswer)

export default router;