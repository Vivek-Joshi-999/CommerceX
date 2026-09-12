const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddlware");

const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

// User routes
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrder);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Admin route
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin"),
  updateOrderStatus
);

module.exports = router;