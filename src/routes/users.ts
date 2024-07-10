import express = require("express");
import { upload } from "../library/helpers/uploadImage";
import {
  RegisterUser,
  getAllStudents,
  loginUser,
  promoteStudent,
  updateProfile,
} from "../conrollers/studentController";
import auth from "../middleware/auth";
const router = express.Router();

/* GET users listing. */
router.post("/register_student", upload.single("profilePhoto"), RegisterUser);
router.post("/login", loginUser);
router.put(
  "/update_profile",
  auth,
  upload.single("profilePhoto"),
  updateProfile
);
router.get("/all_students", getAllStudents);
router.put("/promote/:studentId", promoteStudent);

export default router;
