const Product = require("../models/Product");

// ==========================================
// CREATE PRODUCT
// ==========================================

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
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

// ==========================================
// GET PRODUCTS / SEARCH
// ==========================================

const getProducts = async (req, res, next) => {
  try {
    const { search = "", category = "" } = req.query;

    const filter = {};

    // Simple search
    if (search.trim()) {
      const searchTerm = search.trim();

      filter.$or = [
        {
          name: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          description: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          category: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ];
    }

    // Category filter
    if (category.trim()) {
      filter.category = {
        $regex: `^${category.trim()}$`,
        $options: "i",
      };
    }

    const products = await Product.find(filter);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        stock,
        image,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CREATE PRODUCTS IN BULK
// ==========================================

const createProductsBulk = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products must be a non-empty array",
      });
    }

    if (products.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Maximum 100 products can be added at once",
      });
    }

    const createdProducts = await Product.insertMany(products);

    return res.status(201).json({
      success: true,
      message: `${createdProducts.length} products created successfully`,
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProductsBulk,
};