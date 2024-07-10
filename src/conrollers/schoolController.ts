import { Request, Response } from "express";
import SchoolModel from "../models/schoolModel";
import { createSchoolSchema, editSchoolSchema, option } from "../utils/utils";
import StudentModel from "../models/studentModel";

export const createSchool = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;

    // Validate request body
    const { error } = createSchoolSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Create a new school entry in the database
    const newSchool = await SchoolModel.create({ name, address });

    // Respond with success message and the created school
    res.status(201).json({ message: "School added successfully", newSchool });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the school" });
  }
};

export const editSchool = async (req: Request, res: Response) => {
  try {
    const { name, address } = req.body;
    const { id } = req.params;

    // Validate request body
    const { error } = editSchoolSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ Error: error.details.map((err: any) => err.message) });
    }

    // Find and update the school entry in the database
    const updatedSchool = await SchoolModel.findByIdAndUpdate(
      id,
      { name, address },
      { new: true }
    );

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    // Respond with success message and the updated school
    res
      .status(200)
      .json({ message: "School updated successfully", updatedSchool });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the school" });
  }
};

export const getAllSchools = async (req: Request, res: Response) => {
  try {
    // Fetch all school entries from the database
    const schools = await SchoolModel.find();

    // Respond with the list of schools
    res
      .status(200)
      .json({ message: "Schools retrieved successfully", schools });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving schools" });
  }
};

export const showSchool = async (req: Request, res: Response) => {
  const schoolId = req.params.id;

  try {
    console.log("Received request to show school with ID:", schoolId);

    // Fetch school entry from the database
    const school = await SchoolModel.findById(schoolId);
    console.log("Fetched school:", school);

    if (!school) {
      console.log("School not found");
      return res.status(404).json({ message: "School not found" });
    }

    // Fetch students related to the school
    const students = await StudentModel.find({ school: schoolId });
    console.log("Fetched students:", students);

    res
      .status(200)
      .json({
        message: "School and students retrieved successfully",
        school,
        students,
      });
  } catch (error) {
    console.error("Error while retrieving school and students:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while retrieving school and students",
      });
  }
};
