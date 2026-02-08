import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique: true,
    },
    products: {
      default: [],
      type: {
        product: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          unique: true,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
