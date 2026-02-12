import express from "express";
import Product from "../config/shema/product.js";
const router = express.Router();

//list out all and get products from the search
router.get("/list", async (req, res) => {
  try {
    const { name } = req.query;
    let filter = {};
    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      };
    }
    const products = await Product.find(filter).lean();
    if (products.length === 0 || !products) {
      return res.status(404).json({
        success: false,
        message: "Products not found !",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched !",
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

//get single item
router.get("/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Products not found !",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched !",
      data: product,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

export default router;
