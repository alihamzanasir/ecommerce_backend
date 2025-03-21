import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Otp, User } from "../models/authModel.js";
import { otpGeneratorFnc } from "../utils/index.js";
import { sendMail } from "../lib/nodemailer.js";
import { verifyGoogleToken } from "../lib/googleAuthToken.js";

const generateToken = (payload, expireIn) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expireIn });
};

const signup = async (req, res) => {
  try {
    const { email, provider, password, username, token } = req.body;

    if (!provider) {
      return res.status(400).json({ message: "provider is required" });
    }

    if (!["email", "google"].includes(provider)) {
      return res.status(400).json({ message: "provider is incorrect" });
    }

    const userData = {
      email,
      provider,
      username,
    };

    if (provider === "email") {
      if (!password  || !username || !email) {
        return res
          .status(400)
          .json({ message: "username email password and otp are required" });
      }

      // const otpExit = await Otp.findOne({ email });
      // console.log(otpExit, ".....");
      // if (otpExit.provider !== "signup") {
      //   return res.status(400).json({ message: "Invalid Email" });
      // } else if (otpExit === null) {
      //   return res.status(400).json({ message: "otp is expire please resend" });
      // } else if (otpExit.otp !== otp) {
      //   return res.status(400).json({ message: "invalid otp" });
      // }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email is already registered" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    } else if (provider === "google") {
      const userGoogleData = await verifyGoogleToken(token);
      if (!userGoogleData.email) {
        return res.status(400).json({ message: "invalid google token" });
      }
      userData.email = userGoogleData.email;
      userData.username = userGoogleData.name;
      var jwtToken = generateToken({ email: userData.email }, "1h");
    }

    await User.create(userData);
    return res.status(201).json({
      message:
        provider === "google"
          ? "User signin successfully"
          : "User signed up successfully",
      status: true,
      ...(provider === "google" && { token: jwtToken }),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, provider, password, token } = req.body;

    if (!provider) {
      return res.status(400).json({ message: "provider is required" });
    }

    if (!["email", "google"].includes(provider)) {
      return res.status(400).json({ message: "provider is incorrect" });
    }
    if (provider === "email") {
      var user = await User.findOne({ email });
      if (!password || !email) {
        return res
          .status(400)
          .json({ message: "Password and email are required" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else if (provider === "google") {
      const userGoogleData = await verifyGoogleToken(token);
      if (!userGoogleData.email) {
        return res.status(400).json({ message: "invalid google token" });
      }
      var googleUser = await User.findOne({ email: userGoogleData.email });
    }

    const jwtToken = generateToken(
      {
        id: provider === "email" ? user._id : googleUser._id,
        email: provider === "email" ? user.email : googleUser.email,
      },
      "1h"
    );
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token: jwtToken,
      ...(provider === "email" && { admin: user.admin }),
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", status: false });
  }
};

const otpFnc = async (req, res) => {
  try {
    const { email, provider } = req.body;

    if (!provider) {
      return res
        .status(400)
        .json({ status: false, message: "invalid provider" });
    }
    if (!["signup", "forgot"]) {
      return res
        .status(400)
        .json({ status: false, message: "invalid provider" });
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      return res.status(429).json({
        message:
          "A new OTP can be generated after 1 minute. Please try again later.",
      });
    }

    const otp = otpGeneratorFnc(4);

    await Otp.create({ email, otp, provider });
    await sendMail(email, otp);

    res.json({
      success: true,
      message: "Otp send to your Gmail",
      expiresIn: "1 minut",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res
        .status(400)
        .json({ status: false, message: "email and otp are required" });
    }

    const otpExit = await Otp.findOne({ email });

    if (otpExit === null) {
      return res
        .status(400)
        .json({ status: false, message: "otp is expire please resend" });
    } else if (otpExit.otp !== otp) {
      return res.status(400).json({ status: false, message: "invalid otp" });
    }

    const token = await generateToken({ email }, "5m");

    res
      .status(201)
      .json({ status: true, message: "email verify successfully", token });
  } catch (error) {}
};

const resetPassword = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { password } = req.body;
    const user = await User.findOne({ email: userEmail });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true } // Returns the updated user
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {}
};
export { signup, login, otpFnc, forgotPassword, resetPassword };
