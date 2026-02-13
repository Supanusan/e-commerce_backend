import express from "express";
import Product from "../config/shema/product.js";
import Cart from "../config/shema/cart.js";
const router = express.Router();

//add the product in cart OR creating array
router.post("/add", async (req, res) => {
  try {
    const { product, count } = req.body;
    const cartUser = await Cart.findOne({
      user: req.user.id,
    });
    //product price
    const productPrice = await Product.findById(product).select("price");

    if (!productPrice) {
      return res.status(404).json({
        success: false,
        message: "something went wrong !",
      });
    }
    if (!cartUser) {
      const cart = await Cart.create({
        user: req.user.id,
        products: [
          {
            product,
            count,
            price: count * productPrice.price,
          },
        ],
      });
      if (!cart) {
        return res.status(500).json({
          success: false,
          message: "error while add the cart !",
        });
      }
      return res.status(201).json({
        success: true,
        message: "successfully added !",
      });
    }
    const cart_index = cartUser.products.findIndex(
      (item) => item.product.toString() === product,
    );
    if (cart_index === -1) {
      cartUser.products.push({
        product,
        count,
        price: count * productPrice.price,
      });
      await cartUser.save();
      return res.json({
        message: "successfuly added",
        success: true,
      });
    }
    cartUser.products[cart_index].count = count;
    cartUser.products[cart_index].price = count * productPrice.price;

    await cartUser.save();
    return res.status(200).json({
      message: "successfuly added",
      success: true,
    });
  } catch (error) {
    // console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

//update the cart
router.put("/update", async (req, res) => {
  try {
    const { product, count } = req.body;
    const productPrice = await Product.findById(product).select("price");
    const cartUser = await Cart.findOne({
      user: req.user.id,
    });
    if (cartUser) {
      const cart_index = await cartUser.products.findIndex(
        (item) => item.product.toString() === product,
      );
      if (cart_index === -1) {
        return res.status(400).json({
          success: false,
          message: "product not in the cart !",
        });
      }
      cartUser.products[cart_index].count = count;
      cartUser.products[cart_index].price = count * productPrice.price;
      await cartUser.save();
      return res.status(200).json({
        success: true,
        message: "updated successfull !",
      });
    }
    return res.status(404).json({
      message: "cart not found !",
      success: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

//delete the product
router.delete("/delete", async (req, res) => {
  try {
    const { product } = req.body;
    const cartUser = await Cart.findOne({
      user: req.user.id,
    });
    if (cartUser) {
      const cart_index = await cartUser.products.findIndex(
        (item) => item.product.toString() === product,
      );
      if (cart_index === -1) {
        return res.status(400).json({
          success: false,
          message: "product not in the cart !",
        });
      }
      cartUser.products.splice(cart_index, 1);
      await cartUser.save();
      return res.status(200).json({
        success: true,
        message: "deleted successfull !",
      });
    }
    return res.status(404).json({
      message: "cart not found !",
      success: false,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});

//clear the all route
router.delete("/clear", async (req, res) => {
  try {
    const delete_cart = await Cart.findOneAndDelete({
      user: req.user.id,
    });

    if (!delete_cart) {
      return res.status(404).json({
        message: "cart not found !",
        success: false,
      });
    }
    return res.status(200).json({
      message: "cart deleted successfull !",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "somthing went wrong !" });
  }
});
export default router;
