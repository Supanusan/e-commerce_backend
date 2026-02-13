import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
      unique: true,
    },
    products: [
      {
        product: {
          required: true,
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        count: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          default: 0,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
