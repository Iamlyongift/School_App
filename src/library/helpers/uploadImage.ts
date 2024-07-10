import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import UserRequest from "../../types/userRequest";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (
    req: UserRequest,
    res: Response,
    file: Express.Multer.File
  ) => {
    return {
      folder: "Image_Uploads",
    };
  },
});

export const upload = multer({ storage: storage });
