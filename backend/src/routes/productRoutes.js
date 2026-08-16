
const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/productController");
const { getProducts } = require("../controllers/productController");
const { getProduct } = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddlware");

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createProduct
);
router.get("/", getProducts);
router.get("/:id", getProducts);

module.exports = router;

