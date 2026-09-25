import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Gem,
  House,
  Laptop,
  Shirt,
  Sparkles,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    icon: Laptop,
    color: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    name: "Fashion",
    icon: Shirt,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    name: "Home & Living",
    icon: House,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    name: "Beauty",
    icon: Sparkles,
    color: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    color: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    name: "Accessories",
    icon: Gem,
    color: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
];

function CategorySection() {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

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
              Browse Categories
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#14245c] sm:text-3xl">
              Shop by Category
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="hidden text-sm font-semibold text-indigo-600 transition-colors hover:text-purple-600 sm:block"
          >
            View All
          </button>
        </motion.div>

        {/* Categories */}
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.button
                key={category.name}
                type="button"
                onClick={() => handleCategoryClick(category.name)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.06,
                }}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${category.color}`}
                >
                  <Icon
                    size={30}
                    strokeWidth={1.6}
                    className={category.iconColor}
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-[#14245c] transition-colors duration-200 group-hover:text-indigo-600">
                  {category.name}
                </h3>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;