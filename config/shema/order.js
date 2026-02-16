import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    address: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderStatus: {
      enum: ["pending", "confirmed"],
      default: "pending",
      required: true,
      type: String,
    },

    paymentId: {
      type: String,
      //   required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("order", orderSchema);

export default Order;
