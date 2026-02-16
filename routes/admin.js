import express from "express";
import Product from "../config/shema/product.js";
import upload from "../config/multer.js";
import Order from "../config/shema/order.js";
const router = express.Router();

//all product
router.get("/all-products", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0 || !products) {
      return res.status(404).json({
        message: "no products !",
        success: false,
      });
    }
    return res.status(200).json({
      message: "successfully fetched !",
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

//add product
router.post("/add", upload.array("image"), async (req, res) => {
  try {
    const { name, description, count, price } = req.body;
    const images = req.files.map((e) => e.path);
    const isCreated = await Product.create({
      name,
      description,
      count,
      price,
      image: images,
    });

    if (!isCreated) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong !" });
    }
    return res
      .status(201)
      .json({ success: true, message: "product added successfull !" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

//update product
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, count, price } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
      name,
      description,
      count,
      price,
    });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "something went wrong !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "product updated successfull !" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

//delete product
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const isDeleted = await Product.findByIdAndDelete(id);
    if (!isDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "something went wrong !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "product deleted successfull !" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

//all orders
router.get("/orders/all-orders", async (req, res) => {
  try {
    const all_orders = await Order.find()
      .populate({ path: "user", select: "name -_id" })
      .populate({ path: "products.product", select: "name -_id" })
      .sort({ createdAt: -1 });
    if (!all_orders || all_orders.length === 0) {
      return res.status(404).json({ success: false, message: "no orders !" });
    }
    return res.status(200).json({
      success: true,
      message: "successfully fetched !",
      data: all_orders,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

//update order status
router.put("/order/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, {
      status,
    });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "something went wrong !" });
    }
    return res
      .status(200)
      .json({ success: true, message: "order updated successfull !" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "something went wrong !" });
  }
});

export default router;
