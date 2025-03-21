import { Router } from "express";
import {
  forgotPassword,
  login,
  otpFnc,
  resetPassword,
  signup,
} from "../controller/auth.js";
import authenticateUser from "../middleware/authenticateUser.js";
import { createRequire } from 'module';
import { createRequire } from 'module';

var require = createRequire(import.meta.url);
var module = { exports: {} };

const require = createRequire(import.meta.url);

const router = Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/otp", otpFnc);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", authenticateUser,resetPassword);

export { router };
