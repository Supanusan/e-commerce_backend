import express from "express";
import Product from "../config/shema/product.js";
import upload from "../config/multer.js";
const router = express.Router();

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

export default router;
