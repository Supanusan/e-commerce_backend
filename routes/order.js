import express from "express";
import { v4 as uuid } from "uuid";
import crypto from "crypto";
import dotenv from "dotenv";
import { userAuth } from "../middleware/auth.js";
import Order from "../config/shema/order.js";
import Product from "../config/shema/product.js";
import User from "../config/shema/user.js";

dotenv.config();

const router = express.Router();

// ===============================================
// CREATE ORDER & GENERATE PAYHERE HASH
// ===============================================
router.post("/create", userAuth, async (req, res) => {
  try {
    const { products } = req.body;

    // ===========================
    // ENV VALIDATION
    // ===========================
    const merchant_id = process.env.MERCHANT_ID;
    const merchant_secret = process.env.MERCHANT_SECRET;

    if (!merchant_id || !merchant_secret) {
      return res.status(500).json({
        success: false,
        message: "Merchant credentials not configured",
      });
    }

    // ===========================
    // VALIDATE PRODUCTS
    // ===========================
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products provided",
      });
    }

    // ===========================
    // GET USER & ADDRESS
    // ===========================
    const userData = await User.findById(req.user.id);

    if (!userData || !userData.address) {
      return res.status(400).json({
        success: false,
        message: "Address not found",
      });
    }

    let orderItems = [];
    let totalAmount = 0;
    const orderId = uuid();

    // ===========================
    // CHECK STOCK & CALCULATE TOTAL
    // ===========================
    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.count < item.count) {
        let productName = await Product.findById(product._id).select("name");
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${productName.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        count: item.count,
        price: product.price,
      });

      totalAmount += product.price * item.count;
    }

    // ===========================
    // FORMAT AMOUNT (VERY IMPORTANT)
    // ===========================
    const formattedAmount = Number(totalAmount).toFixed(2);

    // ===========================
    // SAVE ORDER
    // ===========================
    await Order.create({
      user: req.user.id,
      products: orderItems,
      address: {
        address: userData.address.address,
        city: userData.address.city,
      },
      totalAmount: formattedAmount,
      orderId,
    });

    // ===========================
    // GENERATE PAYHERE HASH
    // ===========================
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchant_secret)
      .digest("hex")
      .toUpperCase();

    const hash = crypto
      .createHash("md5")
      .update(merchant_id + orderId + formattedAmount + "LKR" + hashedSecret)
      .digest("hex")
      .toUpperCase();

    // ===========================
    // RESPONSE TO FRONTEND
    // ===========================
    return res.status(201).json({
      success: true,
      message: "Order created. Please proceed to payment.",
      data: {
        sandbox: true, // change to false in production
        merchant_id,
        return_url: "http://localhost:3000/payment/success",
        cancel_url: "http://localhost:3000/payment/cancel",
        notify_url:
          "https://paulina-invocable-shakita.ngrok-free.dev/api/payment/notify",

        order_id: orderId,
        items: "Order Payment",
        currency: "LKR",
        amount: formattedAmount,
        hash,

        first_name: userData.name,
        last_name: "Customer",
        email: userData.email,
        phone: "0759920388",
        address: userData.address.address,
        city: userData.address.city,
        country: "Sri Lanka",
      },
    });
  } catch (error) {
    console.error("Order Creation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/my-orders", userAuth, async (req, res) => {
  try {
    const id = req.user.id;
    const myOrders = await Order.find({ user: id })
      .select("-user ")
      .populate({
        path: "products.product",
        select: "name -_id ", // only required fields
      })
      .sort({ createdAt: -1 }) // latest orders first
      .lean();

    if (myOrders.length === 0 || !myOrders) {
      return res.status(404).json({
        success: false,
        message: "No orders found !",
      });
    }
    return res.json({
      success: true,
      message: "successfully fetched !",
      data: myOrders,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
