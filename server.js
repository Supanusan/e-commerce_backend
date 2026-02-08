import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/mongoose.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
const app = express();
configDotenv();

//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoute);

connectDB();
app.listen(5000, () => {
  console.log("server is running at 5000");
});
