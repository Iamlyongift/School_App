"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    profilePhoto: { type: String, required: true },
    isPromoted: { type: Boolean, required: true },
    school: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "School",
            required: true,
        },
    ],
}, {
    timestamps: true,
});
const StudentModel = mongoose_1.default.model("Student", studentSchema);
module.exports = StudentModel;
