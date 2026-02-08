import express from "express";
import User from "../config/shema/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userAuth from "../middleware/auth.js";
const router = express.Router();

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found !" });
    }
    const correct_password = await bcrypt.compare(password, user.password);
    if (correct_password) {
      const jsonwebtoken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET, // always include a secret
        { expiresIn: "7d" },
      );
      res.cookie("token", jsonwebtoken);
      return res
        .status(200)
        .json({ success: true, message: "login successfull !" });
    }
    return res
      .status(400)
      .json({ success: false, message: "invalid password !" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});
//register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, tel, city, address } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "use have account !" });
    }
    const hashed_Password = await bcrypt.hash(password, 10);

    const isCreated = await User.create({
      name,
      password: hashed_Password,
      email,
      tel,
      address: {
        city,
        address,
      },
    });
    if (!isCreated) {
      return res
        .status(500)
        .json({ success: false, message: "somthing went wrong !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "account created successfull !" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});
//logout
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "logout successfull !" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});
//me
router.get("/me", userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const isUser = await User.findById(userId).select("-password");
    if (!isUser) {
      return res
        .status(404)
        .json({ success: false, message: "user not found !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "fetched succesfull !", data: isUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

export default router;
