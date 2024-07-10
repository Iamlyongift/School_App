"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const schoolSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    user: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
}, {
    timestamps: true,
});
const SchoolModel = mongoose_1.default.model("School", schoolSchema);
module.exports = SchoolModel;
