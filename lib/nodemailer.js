import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.MAIL_PASS_KEY,
  },
});

const sendMail = async (email, otp) => {
  try {
    console.log(process.env.USER_MAIL);
    const info = await transporter.sendMail({
      from: process.env.USER_MAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 5px; width: 400px; margin: auto;">
          <h2 style="color: #4CAF50;">OTP Verification</h2>
          <p>Use the OTP below to verify your email address:</p>
          <h1 style="font-size: 24px; color: #333; padding: 10px; background: #f4f4f4; display: inline-block; border-radius: 5px;">${otp}</h1>
          <p style="color: #777;">This OTP is valid for 1 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    console.log(info);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};

export { sendMail };
