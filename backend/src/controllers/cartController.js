const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // 1. Check whether product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Find cart of logged-in user
    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    // 3. If cart doesn't exist, create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        cart,
      });
    }

    // 4. Check whether product is already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    // 5. If product already exists, increase quantity
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      // 6. Otherwise add new product
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    // 7. Save cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: "Cart is empty",
        cart: {
          user: req.user.userId,
          items: [],
        },
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
