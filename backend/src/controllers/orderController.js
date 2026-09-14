const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      user: req.user.userId,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod:"COD",
      paymentStatus:"pending",
      status:"confirmed",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Order
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
      const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const markPaymentPaid  = async (req,res,next)=>{
  try{
const order = await Order.findById(req.params.id);

if(!order){
  return res.status(404).json({
    success:false,
    message:"order not found"
  });
}

if(order.paymentMethod!=="COD"){
  return res.status(400).json({
    success:false,
    message:"Only COD orders can be marked as paidatus"
  });
}

if(order.status!=="delivered"){
  return res.status(400).json({
    success:false,
    message:"Payment status can be change after delivery"
  })
}
order.paymentStatus="paid";

await order.save();

return res.status(200).json({
  success:true,
  message:"Successfully marked as paid",
  order
})
  }
  catch(error){
    next(error);
  }
}

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if(order.status==="shipped" || order.status==="cancelled"|| order.status==="delivered"){
      return res.status(400).json({
        success:false,
        message:"Order cannot be cancelled"
      })
    }
    order.status="cancelled"
   await order.save();

   return res.status(200).json({
    success:true,
    message:"Order cancelled successfully"
   })
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  markPaymentPaid,
};