import express from 'express'
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
const router = express.Router();
router.route("/checkauth").get(isAuthenticated, checkAuth)
router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/verifyemail").post(verifyEmail)
router.route("/forgotpassword").post(forgotPassword)
router.route("/resetpassword/:token").post(resetPassword)
router.route("/profile/update").put(isAuthenticated ,updateProfile)

export default router;