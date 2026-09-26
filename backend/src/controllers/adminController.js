const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// =====================================================
// ADMIN DASHBOARD
// =====================================================

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      orderStatusCounts,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),

      User.countDocuments({
        role: "customer",
      }),

      Product.countDocuments(),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      Order.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orderStatusCounts.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue,
        orders: statusCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN ORDERS
// =====================================================

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};


// Get single order
const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(
      req.params.id
    ).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateAdminOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Once payment is paid, order cannot be changed
    // -------------------------------------------------

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message:
          "Order status cannot be changed after payment is marked as paid",
      });
    }

    // -------------------------------------------------
    // Update only the status field
    // This avoids validating unrelated old fields
    // such as missing shippingCharge.
    // -------------------------------------------------

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    return res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================

const updateAdminPaymentStatus = async (
  req,
  res,
  next
) => {
  try {
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = [
      "pending",
      "paid",
    ];

    // Validate payment status
    if (
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // Find order
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // -------------------------------------------------
    // Once payment is paid, it cannot be changed
    // -------------------------------------------------

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message:
          "Payment status cannot be changed after payment is marked as paid",
      });
    }

    // -------------------------------------------------
    // Payment can only be marked as paid
    // after order delivery
    // -------------------------------------------------

    if (
      paymentStatus === "paid" &&
      order.status !== "delivered"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Payment can only be marked as paid after delivery",
      });
    }

    // -------------------------------------------------
    // Update only paymentStatus
    // Avoid full document validation
    // -------------------------------------------------

    const updatedOrder =
      await Order.findByIdAndUpdate(
        req.params.id,
        {
          paymentStatus,
        },
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "user",
        "name email"
      );

    return res.status(200).json({
      success: true,
      message:
        "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN PRODUCTS
// =====================================================

// Get all products
const getAllAdminProducts = async (
  req,
  res,
  next
) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


// Create product
const createAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      isActive,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
  };


// Update product
const updateAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      isActive,
    } = req.body;

    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (stock !== undefined) {
      product.stock = stock;
    }

    if (image !== undefined) {
      product.image = image;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};


// Delete product
const deleteAdminProduct = async (
  req,
  res,
  next
) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// ADMIN CUSTOMERS
// =====================================================

// Get all customers
const getAllAdminCustomers = async (
  req,
  res,
  next
) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    next(error);
  }
};


// Update customer
const updateAdminCustomer = async (
  req,
  res,
  next
) => {
  try {
    const { name, email } = req.body;

    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (
      email &&
      email !== customer.email
    ) {
      const existingUser =
        await User.findOne({
          email,
          _id: {
            $ne: req.params.id,
          },
        });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "Email already registered",
        });
      }

      customer.email = email;
    }

    if (name !== undefined) {
      customer.name = name;
    }

    await customer.save();

    return res.status(200).json({
      success: true,
      message:
        "Customer updated successfully",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Delete customer
const deleteAdminCustomer = async (
  req,
  res,
  next
) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        "Customer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
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
};