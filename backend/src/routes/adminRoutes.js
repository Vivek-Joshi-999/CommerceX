const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getAllOrders,
  getAdminOrderById,
  updateAdminOrderStatus,
  updateAdminPaymentStatus,

  createAdminProduct,
  getAllAdminProducts,
  updateAdminProduct,
  deleteAdminProduct,

  getAllAdminCustomers,
  updateAdminCustomer,
  deleteAdminCustomer,
} = require("../controllers/adminController");

const router = express.Router();

// =====================================================
// ADMIN TEST ROUTE
// =====================================================

router.get("/test", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

// =====================================================
// ADMIN ORDERS
// =====================================================

// Get all orders
router.get("/orders", authMiddleware, adminMiddleware, getAllOrders);

// Get single order
router.get("/orders/:id", authMiddleware, adminMiddleware, getAdminOrderById);

// Update order status
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateAdminOrderStatus,
);

// Update payment status
router.put(
  "/orders/:id/payment",
  authMiddleware,
  adminMiddleware,
  updateAdminPaymentStatus,
);

// =====================================================
// ADMIN PRODUCTS
// =====================================================

// Get all products
router.get("/products", authMiddleware, adminMiddleware, getAllAdminProducts);

// Create product
router.post("/products", authMiddleware, adminMiddleware, createAdminProduct);

// Update product
router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  updateAdminProduct,
);

// Delete product
router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminProduct,
);

// =====================================================
// ADMIN CUSTOMERS
// =====================================================

// Get all customers
router.get("/customers", authMiddleware, adminMiddleware, getAllAdminCustomers);

// Update customer
router.put(
  "/customers/:id",
  authMiddleware,
  adminMiddleware,
  updateAdminCustomer,
);

// Delete customer
router.delete(
  "/customers/:id",
  authMiddleware,
  adminMiddleware,
  deleteAdminCustomer,
);

module.exports = router;
