import Joi from "joi";

export const RegisterSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("confirm_password")
    .messages({ "any.only": "{{#label}} does not match" }),
  email: Joi.string().email().required(),
  age: Joi.string().required(),
  schools: Joi.string(), // Changed to string to match Mongoose schema
  schoolId: Joi.string(),
  isPromoted: Joi.boolean().required(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const updateProfileSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  email: Joi.string().email().optional(),
  age: Joi.string().required(),
  profilePhoto: Joi.string().optional(),
});

export const createSchoolSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});

export const editSchoolSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});

// Schema for validating reset password request
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .label("confirmPassword")
    .messages({ "any.only": "{{#label}} does not match" }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
