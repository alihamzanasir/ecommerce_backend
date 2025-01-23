import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
};

const signup = async (req, res) => {
  try {
    const { email, provider, password, username, googleId, avatar, userImg } =
      req.body;

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
      .json({ message: "User signed up successfully", user });
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

export { signup, login };
