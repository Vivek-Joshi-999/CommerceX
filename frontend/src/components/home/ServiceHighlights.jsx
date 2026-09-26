import { motion } from "framer-motion";
import {
  Headphones,
  PackageCheck,
  Star,
  Truck,
} from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders above ₹499",
  },
  {
    icon: PackageCheck,
    title: "Cash on Delivery",
    description: "Pay when your order arrives",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "We're here to help",
  },
  {
    icon: Star,
    title: "Quality Products",
    description: "Carefully selected for you",
  },
];

function ServiceHighlights() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="gap-5 mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
              }}
              className="flex items-center gap-4 px-5 py-5 lg:px-8 bg-indigo-100 rounded-xl "
            >
              {/* Icon */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
                <Icon
                  size={25}
                  strokeWidth={1.8}
                  className="text-indigo-600"
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-sm font-semibold text-[#14245c]">
                  {service.title}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {service.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default ServiceHighlights;