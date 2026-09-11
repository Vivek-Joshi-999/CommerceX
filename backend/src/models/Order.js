const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  },
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [OrderItemSchema],

    shippingAddress: {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", OrderSchema);