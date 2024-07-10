import express = require("express");
import {
  createSchool,
  editSchool,
  getAllSchools,
  showSchool,
} from "../conrollers/schoolController";
const router = express.Router();

/* GET home page. */
router.post("/create_school", createSchool);
router.put("/edit_school/:id", editSchool);
router.get("/getAll_schools", getAllSchools);
router.get("/:id", showSchool);
export default router;
