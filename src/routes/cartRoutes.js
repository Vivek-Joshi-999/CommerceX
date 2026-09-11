const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,updateCartItem,removeCartItem,clearCart
} = require("../controllers/cartController");

router.post("/", authMiddleware, addToCart);

router.get("/", authMiddleware, getCart);

router.put("/:productId", authMiddleware, updateCartItem);
router.put("/:productId", authMiddleware, updateCartItem);
router.delete("/:productId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);
module.exports = router;