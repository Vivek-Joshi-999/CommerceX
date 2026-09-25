import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";

import { getProduct } from "../../services/ProductService";
import { addToGuestCart } from "../../services/guestCartService";
import { addToCart } from "../../services/cartService";
import { formatPrice } from "../../utils/formatPrice";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);

        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        // Logged-in user → MongoDB cart
        await addToCart(product._id, quantity);
      } else {
        // Guest user → localStorage cart
        addToGuestCart(product, quantity);
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
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafbff] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-28 rounded bg-gray-200" />

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-square max-h-[560px] rounded-3xl bg-gray-200" />

            <div className="space-y-5 py-5">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-3/4 rounded bg-gray-200" />
              <div className="h-8 w-32 rounded bg-gray-200" />
              <div className="h-24 rounded bg-gray-200" />
              <div className="h-20 rounded-2xl bg-gray-200" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafbff] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
            <ShoppingCart
              size={28}
              className="text-indigo-600"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#14245c]">
            Product not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            We couldn't find the product you're looking for.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <main className="min-h-screen bg-[#fafbff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back Navigation */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        {/* Main Product Area */}
        <div className="mt-7 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">

          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm sm:min-h-[450px] lg:min-h-[500px]">

              {/* Decorative background */}
              <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-indigo-50 blur-2xl" />
              <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-purple-50 blur-3xl" />

              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 max-h-[360px] w-full max-w-[420px] object-contain transition-transform duration-500 hover:scale-105"
              />

              {/* Category Badge */}
              <div className="absolute left-5 top-5 z-20 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                {product.category}
              </div>
            </div>

            {/* Small Product Information Cards */}
            <div className="mt-4 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <Truck
                  size={20}
                  className="mx-auto text-indigo-600"
                  strokeWidth={1.8}
                />

                <p className="mt-2 text-xs font-semibold text-[#14245c]">
                  Fast Delivery
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <ShieldCheck
                  size={20}
                  className="mx-auto text-indigo-600"
                  strokeWidth={1.8}
                />

                <p className="mt-2 text-xs font-semibold text-[#14245c]">
                  Secure
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                <Headphones
                  size={20}
                  className="mx-auto text-indigo-600"
                  strokeWidth={1.8}
                />

                <p className="mt-2 text-xs font-semibold text-[#14245c]">
                  Support
                </p>
              </div>

            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-center"
          >

            {/* Category */}
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-[#14245c] sm:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-end gap-3">
              <span className="text-3xl font-bold text-[#14245c]">
                ₹{formatPrice(product.price)}
              </span>

              <span className="pb-1 text-sm text-gray-400">
                Inclusive of applicable taxes
              </span>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-200" />

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold text-[#14245c]">
                About this product
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Availability
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isInStock
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />

                    <span
                      className={`text-sm font-semibold ${
                        isInStock
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {isInStock
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>

                  </div>
                </div>

                {isInStock && (
                  <p className="text-xs text-gray-500">
                    {product.stock} units available
                  </p>
                )}

              </div>
            </div>

            {/* Quantity + Cart */}
            {isInStock && (
              <div className="mt-6">

                <p className="mb-2 text-sm font-semibold text-[#14245c]">
                  Quantity
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* Quantity Control */}
                  <div className="flex h-12 w-fit items-center rounded-xl border border-gray-200 bg-white">

                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity === 1}
                      className="flex h-full w-11 items-center justify-center text-gray-500 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="flex w-10 justify-center text-sm font-semibold text-[#14245c]">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-full w-11 items-center justify-center text-gray-500 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                  {/* Add To Cart */}
                  <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    animate={
                      isAdded
                        ? {
                            scale: [1, 1.04, 1],
                          }
                        : {
                            scale: 1,
                          }
                    }
                    transition={{
                      duration: 0.3,
                    }}
                    className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md ${
                      isAdded
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check
                          size={18}
                          strokeWidth={2.5}
                        />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} />
                        Add to Cart
                      </>
                    )}
                  </motion.button>

                </div>
              </div>
            )}

            {/* Product Benefits */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <div className="flex items-start gap-3 rounded-xl bg-indigo-50/60 p-4">
                <Check
                  size={18}
                  className="mt-0.5 shrink-0 text-indigo-600"
                />

                <div>
                  <p className="text-xs font-semibold text-[#14245c]">
                    Quality Products
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Carefully selected products for everyday use.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-purple-50/60 p-4">
                <Check
                  size={18}
                  className="mt-0.5 shrink-0 text-purple-600"
                />

                <div>
                  <p className="text-xs font-semibold text-[#14245c]">
                    Secure Checkout
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your order information stays protected.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Lower Product Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-14"
        >
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-indigo-600" />

              <h2 className="text-xl font-bold text-[#14245c]">
                Product Information
              </h2>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Product
                </p>

                <p className="mt-1 text-sm font-semibold text-[#14245c]">
                  {product.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Category
                </p>

                <p className="mt-1 text-sm font-semibold text-[#14245c]">
                  {product.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Price
                </p>

                <p className="mt-1 text-sm font-semibold text-[#14245c]">
                  ₹{formatPrice(product.price)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Stock
                </p>

                <p className="mt-1 text-sm font-semibold text-[#14245c]">
                  {product.stock} units
                </p>
              </div>

            </div>

            <div className="mt-8 border-t border-gray-100 pt-7">

              <h3 className="text-sm font-bold text-[#14245c]">
                Description
              </h3>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-gray-600">
                {product.description}
              </p>

            </div>
          </div>
        </motion.section>

      </div>
    </main>
  );
}

export default ProductDetails;