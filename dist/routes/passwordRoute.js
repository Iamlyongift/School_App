"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passwordController_1 = require("../conrollers/passwordController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.put("/changePassword", auth_1.default, passwordController_1.changePassword);
router.put("/resetPassword", passwordController_1.resetPassword);
router.post("/forgotPassword", passwordController_1.forgotPassword);
exports.default = router;
