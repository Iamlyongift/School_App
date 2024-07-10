"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolController_1 = require("../controller/schoolController");
const router = express_1.default.Router();
router.post("/create_school", schoolController_1.createSchool);
router.put("/edit_school/:schoolId", schoolController_1.editSchool);
router.get("/all_schools", schoolController_1.getAllSchools);
exports.default = router;
