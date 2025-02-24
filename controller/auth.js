import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Otp, User } from "../models/authModel.js";
import { otpGeneratorFnc } from "../utils/index.js";
import { sendMail } from "../lib/nodemailer.js";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

const signup = async (req, res) => {
  try {
    const {
      email,
      provider,
      password,
      username,
      googleId,
      avatar,
      userImg,
      // otp,
    } = req.body;

    if (!provider) {
      return res.status(400).json({ message: "provider is required" });
    }
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const userData = {
      email,
      provider,
      username,
      avatar: avatar || null,
      userImg: userImg || null,
    };

    if (provider === "email") {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    } else if (provider === "google") {
      userData.googleId = googleId;
    }

    const user = await User.create(userData);
    return res
      .status(201)
      .json({ message: "User signed up successfully", status: true });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, provider, password } = req.body;

    if (!email || !provider) {
      return res
        .status(400)
        .json({ message: "Email and provider are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (provider === "email") {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else if (provider === "google") {
      if (!user.googleId) {
        return res.status(401).json({ message: "Invalid Google user" });
      }
    }

    const token = generateToken({ id: user._id, email: user.email });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const otpFnc = async (req, res) => {
  try {
    const { email } = req.body;

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      return res.status(429).json({
        message:
          "A new OTP can be generated after 1 minute. Please try again later.",
      });
    }

    const otp = otpGeneratorFnc(4);

    await Otp.create({ email, otp });
    await sendMail(email, otp);

    res.json({
      success: true,
      message: "OTP generated successfully",
      expiresIn: "1 minut",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { signup, login, otpFnc };
