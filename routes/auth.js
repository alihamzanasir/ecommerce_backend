import { Router } from "express";
import { login, otpFnc, signup } from "../controller/auth.js";

const router = Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/otp", otpFnc);

export { router };
