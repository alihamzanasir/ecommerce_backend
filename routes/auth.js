import { Router } from "express";
import {
  forgotPassword,
  login,
  otpFnc,
  resetPassword,
  signup,
} from "../controller/auth.js";
import authenticateUser from "../middleware/authenticateUser.js";

const router = Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/otp", otpFnc);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authenticateUser,resetPassword);

export { router };
