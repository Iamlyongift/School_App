import mongoose from "mongoose";

interface SchoolType {
  [key: string]: string | boolean | Array<string>;
}

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const SchoolModel = mongoose.model<SchoolType>("School", schoolSchema);

export = SchoolModel;
