"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const uploadImage_1 = require("../library/helpers/uploadImage");
const studentController_1 = require("../conrollers/studentController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express.Router();
router.post("/register_student", uploadImage_1.upload.single("profilePhoto"), studentController_1.RegisterUser);
router.post("/login", studentController_1.loginUser);
router.put("/update_profile", auth_1.default, uploadImage_1.upload.single("profilePhoto"), studentController_1.updateProfile);
router.get("/all_students", studentController_1.getAllStudents);
router.put("/promote/:studentId", studentController_1.promoteStudent);
exports.default = router;
