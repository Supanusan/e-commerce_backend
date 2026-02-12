import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/mongoose.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import productsRoute from "./routes/product.js";
import adminRoute from "./routes/admin.js";
import { adminAuth } from "./middleware/auth.js";
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
app.use("/api/products", productsRoute);
app.use("/api/admin", adminAuth, adminRoute);

connectDB();
app.listen(5000, () => {
  console.log("server is running at 5000");
});
