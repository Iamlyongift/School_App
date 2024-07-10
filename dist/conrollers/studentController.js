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
exports.promoteStudent = exports.getAllStudents = exports.updateProfile = exports.loginUser = exports.RegisterUser = void 0;
const utils_1 = require("../utils/utils");
const studentModel_1 = __importDefault(require("../models/studentModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = require("cloudinary");
const schoolModel_1 = __importDefault(require("../models/schoolModel"));
const jwtsecret = process.env.JWT_SECRET;
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("File:", req.file);
        console.log("Body:", req.body);
        const { name, password, confirm_password, email, age, isPromoted, schoolId, } = req.body;
        const school = yield schoolModel_1.default.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }
        const { error, value } = utils_1.RegisterSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        if (password !== confirm_password) {
            return res.status(400).json({ Error: "Passwords do not match" });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(12));
        const existingUser = yield studentModel_1.default.findOne({ email });
        let pictureUrl = "";
        if (req.file) {
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
        }
        if (!existingUser) {
            const newUser = yield studentModel_1.default.create({
                name,
                password: passwordHash,
                email,
                age,
                school: school._id,
                profilePhoto: pictureUrl,
                isPromoted,
            });
            return res.status(200).json({ msg: "Registration successful", newUser });
        }
        return res.status(400).json({ error: "User already exists" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});
exports.RegisterUser = RegisterUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Body:", req.body);
        const email = req.body.email;
        const password = req.body.password;
        console.log("Validating user...");
        const validateUser = utils_1.LoginSchema.validate(req.body, utils_1.option);
        if (validateUser.error) {
            console.log("Validation error:", validateUser.error.details[0].message);
            return res
                .status(400)
                .json({ Error: validateUser.error.details[0].message });
        }
        console.log("Finding user by email...");
        const user = yield studentModel_1.default.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({ error: "User not found" });
        }
        console.log("User found:", user);
        const { _id } = user;
        console.log("Comparing passwords...");
        const validUser = yield bcryptjs_1.default.compare(password, user.password);
        if (!validUser) {
            console.log("Invalid password");
            return res.status(400).json({ error: "Invalid password" });
        }
        console.log("Generating token...");
        const token = jsonwebtoken_1.default.sign({ _id }, jwtsecret, { expiresIn: "30d" });
        console.log("Login successful");
        return res.status(200).json({
            msg: "Login Successful",
            user,
            token,
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginUser = loginUser;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
        const { password, email, age } = req.body;
        console.log("Validating request body...");
        const { error, value } = utils_1.updateProfileSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            console.log("Validation error:", error.details);
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        console.log("Hashing password...");
        const passwordHash = yield bcryptjs_1.default.hash(password, yield bcryptjs_1.default.genSalt(12));
        let pictureUrl = "";
        if (req.file) {
            console.log("Uploading file to Cloudinary...");
            const result = yield cloudinary_1.v2.uploader.upload(req.file.path);
            pictureUrl = result.secure_url;
            console.log("File uploaded. Picture URL:", pictureUrl);
        }
        console.log("Updating user profile...");
        const profile = yield studentModel_1.default.findByIdAndUpdate(req.user._id, {
            password: passwordHash,
            email,
            age,
            profilePhoto: pictureUrl,
        }, { new: true });
        if (!profile) {
            console.log("User not found with ID:", req.user._id);
            return res.status(404).json({ message: "User not found" });
        }
        console.log("User profile updated:", profile);
        res.status(200).json({ message: "User updated", profile });
    }
    catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.updateProfile = updateProfile;
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield studentModel_1.default.find();
        res.status(200).json({ students });
    }
    catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.getAllStudents = getAllStudents;
const promoteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId } = req.params;
        const student = yield studentModel_1.default.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        student.isPromoted = true;
        yield student.save();
        res.status(200).json({ message: "Student promoted successfully", student });
    }
    catch (error) {
        console.error("Error promoting student:", error);
        res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.promoteStudent = promoteStudent;
