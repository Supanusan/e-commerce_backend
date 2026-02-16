import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/mongoose.js";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import productsRoute from "./routes/product.js";
import adminRoute from "./routes/admin.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import { adminAuth, userAuth } from "./middleware/auth.js";
const app = express();
configDotenv();

//middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend URL
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
app.use("/api/cart", userAuth, cartRoute);
app.use("/api/orders", userAuth, orderRoute);
app.use("/api/payment", paymentRoute);

connectDB();
app.listen(5000, () => {
  console.log("server is running at 5000");
});
