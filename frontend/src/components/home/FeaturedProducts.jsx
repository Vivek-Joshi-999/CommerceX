import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import { getProducts } from "../../services/productService";
import ProductCard from "../product/ProductCard";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        setProducts(data.slice(0, 10));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Featured Products
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#14245c] sm:text-3xl">
              Popular Picks
            </h2>
          </div>

          <Link
            to="/shop"
            className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-purple-600 sm:flex"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Products */}
        {loading ? (
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="aspect-square animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="mt-7 text-sm text-gray-500">
            No products available.
          </p>
        ) : (
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;