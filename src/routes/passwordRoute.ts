import express from "express";
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "../conrollers/passwordController";
import auth from "../middleware/auth";

const router = express.Router();

// POST route for "forgot password" (request reset)
router.put("/changePassword", auth, changePassword);
router.put("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);
// POST route for "reset password"

export default router;
