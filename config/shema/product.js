import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      default: 0,
      type: Number,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

export default Product;
