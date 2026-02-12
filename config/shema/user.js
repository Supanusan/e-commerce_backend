import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    tel: { type: String, required: true, unique: true },
    address: {
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

export default User;
