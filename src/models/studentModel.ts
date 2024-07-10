import mongoose from "mongoose";

interface StudentType {
  [key: string]: string | boolean | Array<string>;
}

const studentSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model<StudentType>("Student", studentSchema);

export = StudentModel;
