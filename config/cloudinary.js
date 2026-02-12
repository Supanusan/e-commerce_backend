import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv(); // load .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary; // MUST export the v2 instance
