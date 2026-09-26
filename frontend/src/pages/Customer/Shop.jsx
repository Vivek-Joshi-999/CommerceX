import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getProducts } from "../../services/productService";
import ProductCard from "../../components/product/ProductCard";

function Shop() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(
          search,
          category,
          subcategory
        );

        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category, subcategory]);

  const pageTitle = subcategory
    ? `${subcategory} Products`
    : category
      ? `${category} Products`
      : search
        ? `Results for "${search}"`
        : "Shop All Products";

  const pageDescription = subcategory
    ? `Explore products in the ${subcategory} category.`
    : category
      ? `Explore products available in the ${category} category.`
      : search
        ? "Explore products matching your search."
        : "Explore our collection of products and find something that fits your needs.";

  return (
    <main className="min-h-screen bg-[#fafbff] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-semibold text-indigo-600">
            {subcategory || category
              ? "Browse Category"
              : "CommerceX Store"}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#14245c] sm:text-4xl">
            {pageTitle}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {pageDescription}
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {[...Array(10)].map((_, index) => (
              <div
                key={index}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-lg font-semibold text-[#14245c]">
                {search
                  ? "No matching products found"
                  : category
                    ? "No products found in this category"
                    : "No products available"}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {search
                  ? `We couldn't find any products matching "${search}".`
                  : category
                    ? `There are currently no products in ${category}.`
                    : "There are currently no products to display."}
              </p>
            </div>
          )}

        {/* Products */}
        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.04,
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

      </div>
    </main>
  );
}

export default Shop;