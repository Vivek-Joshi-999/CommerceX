import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

import { addToGuestCart } from "../../services/guestCartService";
import { addToCart } from "../../services/cartService";
import { formatPrice } from "../../utils/formatPrice";

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (token) {
        // Logged-in user → MongoDB cart
        await addToCart(product._id, 1);
      } else {
        // Guest user → localStorage cart
        addToGuestCart(product, 1);
      }

      setIsAdded(true);

      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
    >
      {/* =========================================
          PRODUCT IMAGE
      ========================================= */}

      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />

        </div>
      </Link>

      {/* =========================================
          PRODUCT INFORMATION
      ========================================= */}

      <div className="p-4">

        <Link to={`/product/${product._id}`}>

          <p className="text-xs font-medium text-indigo-600">
            {product.category}
          </p>

          <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-[#14245c] transition-colors duration-200 group-hover:text-indigo-600">
            {product.name}
          </h3>

        </Link>

        {/* =========================================
            PRICE + CART
        ========================================= */}

        <div className="mt-3 flex items-center justify-between gap-3">

          <span className="text-base font-bold text-[#14245c]">
            ₹{formatPrice(product.price)}
          </span>

          <motion.button
            type="button"
            aria-label={
              isAdded
                ? "Added to cart"
                : "Add to cart"
            }
            onClick={handleAddToCart}
            disabled={loading || isAdded}
            animate={
              isAdded
                ? {
                    scale: [1, 1.15, 1],
                  }
                : {
                    scale: 1,
                  }
            }
            transition={{
              duration: 0.3,
            }}
            className={`flex h-9 items-center justify-center gap-1.5 rounded-full px-3 text-white transition-all duration-200 ${
              isAdded
                ? "bg-green-500"
                : "bg-indigo-600 hover:bg-indigo-700"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >

            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : isAdded ? (
              <>
                <Check
                  size={16}
                  strokeWidth={2.5}
                />

                <span className="text-xs font-semibold">
                  Added
                </span>
              </>
            ) : (
              <ShoppingCart size={17} />
            )}

          </motion.button>

        </div>

      </div>
    </motion.div>
  );
}

export default ProductCard;