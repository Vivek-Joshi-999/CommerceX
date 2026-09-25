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
  markPaymentPaid,
} = require("../controllers/orderController");

// Create order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);

// Get single order
router.get(
  "/:id",
  authMiddleware,
  getOrder
);

// Cancel user's order
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

// Admin: update order status
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("admin"),
  updateOrderStatus
);

// Admin: mark COD payment as paid
router.put(
  "/:id/payment",
  authMiddleware,
  authorizeRoles("admin"),
  markPaymentPaid
);

module.exports = router;