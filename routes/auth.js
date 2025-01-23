import { Router } from "express";
import { login, signup } from "../controller/auth.js";

const router = Router();

router.post("/register", signup);
router.post("/login", login);


export {router}