"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.editSchoolSchema = exports.createSchoolSchema = exports.updateProfileSchema = exports.option = exports.LoginSchema = exports.RegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.RegisterSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    password: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirm_password: joi_1.default.string()
        .valid(joi_1.default.ref("password"))
        .required()
        .label("confirm_password")
        .messages({ "any.only": "{{#label}} does not match" }),
    email: joi_1.default.string().email().required(),
    age: joi_1.default.string().required(),
    schools: joi_1.default.string(),
    schoolId: joi_1.default.string(),
    isPromoted: joi_1.default.boolean().required(),
});
exports.LoginSchema = joi_1.default.object({
    email: joi_1.default.string().required(),
    password: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
exports.option = {
    abortearly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};
exports.updateProfileSchema = joi_1.default.object({
    password: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    email: joi_1.default.string().email().optional(),
    age: joi_1.default.string().required(),
    profilePhoto: joi_1.default.string().optional(),
});
exports.createSchoolSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.editSchoolSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
exports.changePasswordSchema = joi_1.default.object({
    oldPassword: joi_1.default.string().required(),
    newPassword: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.string().min(6).required(),
});
exports.resetPasswordSchema = joi_1.default.object({
    token: joi_1.default.string().required(),
    newPassword: joi_1.default.string()
        .min(6)
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .label("confirmPassword")
        .messages({ "any.only": "{{#label}} does not match" }),
});
exports.forgotPasswordSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
