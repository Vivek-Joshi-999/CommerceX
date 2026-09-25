const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductsBulk,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddlware");

//  Admin only
router.post("/", authMiddleware, authorizeRoles("admin"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post(
  "/bulk",

  createProductsBulk
);

//  Admin only
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateProduct);

// Delete product - Admin only
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteProduct);

module.exports = router;
