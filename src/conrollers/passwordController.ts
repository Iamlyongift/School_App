import { Request, Response } from "express";
import StudentModel from "../models/studentModel"; // Import your Student model/interface
import {
  changePasswordSchema,
  forgotPasswordSchema,
  option,
} from "../utils/utils";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import ResetToken from "../models/passwordModel";

const jwtSecret = process.env.JWT_SECRET as string;

//change password
export const changePassword = async (req: Request | any, res: Response) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Log request body
    console.log("Request body:", req.body);

    // Validate request body
    const { error } = changePasswordSchema.validate(req.body, option);
    if (error) {
      console.log(
        "Validation error:",
        error.details.map((err: any) => err.message)
      );
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Get user from request (assuming user is added to req by auth middleware)
    const userId = req.user._id;
    console.log("User ID:", userId);

    // Fetch user from database
    const user = await StudentModel.findById(userId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log("Old password is incorrect");
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      console.log("New passwords do not match");
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(
      newPassword,
      await bcrypt.genSalt(12)
    );
    console.log("New password hash generated");

    // Update password in the database
    user.password = passwordHash;
    await user.save();
    console.log("Password updated successfully");

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  console.log("Reset Password Request Body:", req.body);

  try {
    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const userId = resetToken.userId;
    const user = await StudentModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const passwordHash = await bcrypt.hash(
      newPassword,
      await bcrypt.genSalt(12)
    );
    user.password = passwordHash;
    await user.save();

    // Remove the used reset token from the database
    await resetToken.deleteOne();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

//forgot password
const generateRandomToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit string token
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  // Validate the request body using Joi schema
  const { error } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ Error: error.details.map((err: any) => err.message) });
  }

  try {
    const user = await StudentModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateRandomToken();

    const resetToken = new ResetToken({
      userId: user._id,
      token,
    });
    await resetToken.save();

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER || "31fcae5b162f4a", // Use environment variables for sensitive information
        pass: process.env.MAILTRAP_PASS || "01824d868af815",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "your_email@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested to reset the password for your account.\n\n
      Please use the following 6-digit token to complete the process:\n\n
      Token: ${token}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset token sent to your email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
