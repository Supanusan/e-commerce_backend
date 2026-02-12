import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { v4 as uuid } from "uuid";
import path from "path";

const uniqueName = uuid();
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ecommerce", // folder name in Cloudinary
    format: async (req, file) => file.mimetype.split("/")[1], // keep original extension
    public_id: (req, file) => {
      const nameWithoutExt = path.parse(file.originalname).name; // remove extension
      return `${uniqueName}-${nameWithoutExt}`;
    },
  },
});

const upload = multer({ storage });

export default upload;
