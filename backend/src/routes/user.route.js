import {Router} from "express"
import {registerUser, loginUser, logoutUser, refreshAccessToken, refreshAccessTokenOnly} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-access").post(refreshAccessToken)
router.route("/refresh-access-only").post(refreshAccessTokenOnly)

export default router;