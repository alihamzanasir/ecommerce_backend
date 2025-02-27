import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  provider: {
    type: String,
    enum: ["email", "google"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    enum: ["signup", "forgot"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // The document will be automatically deleted after 5 minutes of its creation time
  },
});

const User = mongoose.model("User", userSchema);
const Otp = mongoose.model("Otp", otpSchema);

export { User, Otp };
