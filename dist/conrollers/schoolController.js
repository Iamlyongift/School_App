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
exports.showSchool = exports.getAllSchools = exports.editSchool = exports.createSchool = void 0;
const schoolModel_1 = __importDefault(require("../models/schoolModel"));
const utils_1 = require("../utils/utils");
const studentModel_1 = __importDefault(require("../models/studentModel"));
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address } = req.body;
        const { error } = utils_1.createSchoolSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        const newSchool = yield schoolModel_1.default.create({ name, address });
        res.status(201).json({ message: "School added successfully", newSchool });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while creating the school" });
    }
});
exports.createSchool = createSchool;
const editSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address } = req.body;
        const { id } = req.params;
        const { error } = utils_1.editSchoolSchema.validate(req.body, {
            abortEarly: false,
        });
        if (error) {
            return res
                .status(400)
                .json({ Error: error.details.map((err) => err.message) });
        }
        const updatedSchool = yield schoolModel_1.default.findByIdAndUpdate(id, { name, address }, { new: true });
        if (!updatedSchool) {
            return res.status(404).json({ message: "School not found" });
        }
        res
            .status(200)
            .json({ message: "School updated successfully", updatedSchool });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while updating the school" });
    }
});
exports.editSchool = editSchool;
const getAllSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schools = yield schoolModel_1.default.find();
        res
            .status(200)
            .json({ message: "Schools retrieved successfully", schools });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "An error occurred while retrieving schools" });
    }
});
exports.getAllSchools = getAllSchools;
const showSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const schoolId = req.params.id;
    try {
        console.log("Received request to show school with ID:", schoolId);
        const school = yield schoolModel_1.default.findById(schoolId);
        console.log("Fetched school:", school);
        if (!school) {
            console.log("School not found");
            return res.status(404).json({ message: "School not found" });
        }
        const students = yield studentModel_1.default.find({ school: schoolId });
        console.log("Fetched students:", students);
        res
            .status(200)
            .json({
            message: "School and students retrieved successfully",
            school,
            students,
        });
    }
    catch (error) {
        console.error("Error while retrieving school and students:", error);
        res
            .status(500)
            .json({
            message: "An error occurred while retrieving school and students",
        });
    }
});
exports.showSchool = showSchool;
