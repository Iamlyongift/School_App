import { Request, Response } from "express";
import {
  LoginSchema,
  RegisterSchema,
  option,
  updateProfileSchema,
} from "../utils/utils";
import StudentModel from "../models/studentModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinaryV2 } from "cloudinary";
import SchoolModel from "../models/schoolModel";

const jwtsecret = process.env.JWT_SECRET as string;

export const RegisterUser = async (req: Request, res: Response) => {
  try {
    // Log the incoming file and body data
    console.log("File:", req.file);
    console.log("Body:", req.body);
    const {
      name,
      password,
      confirm_password,
      email,
      age,
      isPromoted,
      schoolId,
    } = req.body;

    const school = await SchoolModel.findById(schoolId);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // Validate user input
    const { error, value } = RegisterSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Ensure passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ Error: "Passwords do not match" });
    }

    // Hashing password
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));

    const existingUser = await StudentModel.findOne({ email });

    // Initialize a variable to store the picture URL
    let pictureUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      // Upload the image to Cloudinary and retrieve its URL
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
    }

    // Create a new user document if the user doesn't already exist
    if (!existingUser) {
      const newUser = await StudentModel.create({
        name,
        password: passwordHash,
        email,
        age,
        school: school._id,
        profilePhoto: pictureUrl, // Ensure profilePhoto is set correctly
        isPromoted,
      });
      return res.status(200).json({ msg: "Registration successful", newUser });
    }
    return res.status(400).json({ error: "User already exists" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    console.log("Body:", req.body);

    const email = req.body.email;
    const password = req.body.password; // Fixed the variable name to 'password' from 'passWord'

    // Validate user
    console.log("Validating user...");
    const validateUser = LoginSchema.validate(req.body, option);

    if (validateUser.error) {
      console.log("Validation error:", validateUser.error.details[0].message);
      return res
        .status(400)
        .json({ Error: validateUser.error.details[0].message });
    }

    // Verify if user exists
    console.log("Finding user by email...");
    const user = await StudentModel.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "User not found" });
    }
    console.log("User found:", user);

    const { _id } = user;

    // Compare password
    console.log("Comparing passwords...");
    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      console.log("Invalid password");
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate token
    console.log("Generating token...");
    const token = jwt.sign({ _id }, jwtsecret, { expiresIn: "30d" });

    console.log("Login successful");
    return res.status(200).json({
      msg: "Login Successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request | any, res: Response) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    const { password, email, age } = req.body;

    // Validate request body
    console.log("Validating request body...");
    const { error, value } = updateProfileSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.log("Validation error:", error.details);
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Check password confirmation
    console.log("Hashing password...");
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(12));

    let pictureUrl = "";

    // Check if a file was uploaded
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      const result = await cloudinaryV2.uploader.upload(req.file.path);
      pictureUrl = result.secure_url; // Store the URL of the uploaded picture
      console.log("File uploaded. Picture URL:", pictureUrl);
    }

    // Find and update the user profile using the authenticated user's ID
    console.log("Updating user profile...");
    const profile = await StudentModel.findByIdAndUpdate(
      req.user._id,
      {
        password: passwordHash,
        email,
        age,
        profilePhoto: pictureUrl,
      },
      { new: true }
    );

    if (!profile) {
      console.log("User not found with ID:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User profile updated:", profile);
    res.status(200).json({ message: "User updated", profile });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const promoteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Find the student by ID
    const student = await StudentModel.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update the student's promotion status
    student.isPromoted = true;
    await student.save();

    res.status(200).json({ message: "Student promoted successfully", student });
  } catch (error) {
    console.error("Error promoting student:", error);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
};
