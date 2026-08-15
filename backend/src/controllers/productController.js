const Product = require("../models/Product");

const createProduct = async (req, res,next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {

    next(error);
    
  }
};

const getProducts = async (req, res,next) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
 next(error);
  }
};

const updateProduct = async (req, res,next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators:true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
 next(error);
  }
};

const deleteProduct = async (req, res,next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
