"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.resetPassword = exports.changePassword = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passwordModel_1 = __importDefault(require("../models/passwordModel"));
const jwtSecret = process.env.JWT_SECRET;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        console.log("Request body:", req.body);
        const { error } = utils_1.changePasswordSchema.validate(req.body, utils_1.option);
        if (error) {
            console.log("Validation error:", error.details.map((err) => err.message));
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        const userId = req.user._id;
        console.log("User ID:", userId);
        const user = yield studentModel_1.default.findById(userId);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            console.log("Old password is incorrect");
            return res.status(400).json({ message: "Old password is incorrect" });
        }
        if (newPassword !== confirmPassword) {
            console.log("New passwords do not match");
            return res.status(400).json({ message: "New passwords do not match" });
        }
        const passwordHash = yield bcryptjs_1.default.hash(newPassword, yield bcryptjs_1.default.genSalt(12));
        console.log("New password hash generated");
        user.password = passwordHash;
        yield user.save();
        console.log("Password updated successfully");
        res.status(200).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.changePassword = changePassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    console.log("Reset Password Request Body:", req.body);
    try {
        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }
        const resetToken = yield passwordModel_1.default.findOne({ token });
        if (!resetToken) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const userId = resetToken.userId;
        const user = yield studentModel_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User found:", user);
        const passwordHash = yield bcryptjs_1.default.hash(newPassword, yield bcryptjs_1.default.genSalt(12));
        user.password = passwordHash;
        yield user.save();
        yield resetToken.deleteOne();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Error in reset password:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.resetPassword = resetPassword;
const generateRandomToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const { error } = utils_1.forgotPasswordSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) {
        return res
            .status(400)
            .json({ Error: error.details.map((err) => err.message) });
    }
    try {
        const user = yield studentModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = generateRandomToken();
        const resetToken = new passwordModel_1.default({
            userId: user._id,
            token,
        });
        yield resetToken.save();
        const transporter = nodemailer_1.default.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER || "31fcae5b162f4a",
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
        yield transporter.sendMail(mailOptions);
        res
            .status(200)
            .json({ message: "Password reset token sent to your email" });
    }
    catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.forgotPassword = forgotPassword;
