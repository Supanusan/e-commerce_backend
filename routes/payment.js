import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../config/shema/order.js";
import Product from "../config/shema/product.js";

dotenv.config();

const router = express.Router();

router.post("/notify", async (req, res) => {
  try {
    console.log("Payment notification received");

    const merchant_secret = process.env.MERCHANT_SECRET;

    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body;

    const order = await Order.findOne({ orderId: order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ===============================
    // VERIFY HASH
    // ===============================
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();

    const local_md5sig = crypto
      .createHash("md5")
      .update(
        merchant_id +
          order_id +
          payhere_amount +
          payhere_currency +
          status_code +
          hashedSecret,
      )
      .digest("hex")
      .toUpperCase();

    console.log("Generated MD5:", local_md5sig);
    console.log("PayHere MD5:", md5sig);

    // ===============================
    // PAYMENT SUCCESS
    // ===============================
    if (local_md5sig === md5sig && status_code === "2") {
      console.log("Payment successful for order:", order_id);

      // Update order
      order.orderStatus = "confirmed";
      order.paymentId = payment_id;
      await order.save();

      // ===============================
      // UPDATE STOCK CORRECTLY
      // ===============================
      for (const item of order.products) {
        const product = await Product.findById(item.product);

        if (product) {
          product.count -= item.count;
          await product.save();
        }
      }

      return res.sendStatus(200);
    }

    console.log("Payment verification failed");

    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  } catch (error) {
    console.error("Notify Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
