import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="bg-white px-4 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-gradient-to-br from-[#f5f7ff] via-[#f8f8ff] to-[#eef5ff]">
        <div className="grid min-h-[430px] items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-10">

          {/* =========================
              LEFT CONTENT
          ========================== */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <span className="inline-flex rounded-full bg-indigo-100/80 px-3 py-1.5 text-xs font-medium text-indigo-600">
              Welcome to CommerceX
            </span>

            {/* Heading */}
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-[#13245c] sm:text-5xl">
              Find what you need.
              <br />

              <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                Discover more.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Explore amazing products, get smart recommendations, and enjoy a
              seamless shopping experience.
            </p>

            {/* Explore Button */}
            <button
              type="button"
              className="group mt-5 flex items-center gap-2 text-sm font-semibold text-indigo-600"
            >
              Explore Products

              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          {/* =========================
              RIGHT PRODUCT VISUAL
          ========================== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="relative mx-auto h-[320px] w-full max-w-[520px]"
          >
            {/* Background Blob */}
            <div className="absolute left-24 top-8 h-64 w-64 rounded-full bg-indigo-100/70 blur-sm" />

            <div className="absolute right-8 top-4 h-52 w-52 rounded-full bg-blue-100/70" />

            {/* =========================
                HEADPHONES
            ========================== */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-12 top-8 z-30 flex h-32 w-32 rotate-[-8deg] items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <img
                src="https://i.pinimg.com/1200x/27/de/84/27de84c8999342c67a43b0c0298ee9dc.jpg"
                alt="Wireless headphones"
                className="h-full w-full object-contain p-3"
              />
            </motion.div>

            {/* =========================
                LAPTOP
            ========================== */}
            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute right-6 top-10 z-20 h-40 w-64 rotate-[-3deg] overflow-hidden rounded-2xl border border-white bg-white p-2 shadow-xl"
            >
              <img
                src="https://i.pinimg.com/1200x/1e/7a/85/1e7a85983919262fe06785c05097ee0d.jpg"
                alt="Laptop"
                className="h-full w-full rounded-xl object-cover"
              />
            </motion.div>

            {/* =========================
                SMARTPHONE
            ========================== */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-6 left-36 z-40 h-36 w-20 rotate-[-5deg] overflow-hidden rounded-[20px] border-4 border-white bg-white shadow-xl"
            >
              <img
                src="https://i.pinimg.com/736x/d1/d3/bb/d1d3bb16f95d984e240438a1a2112063.jpg"
                alt="Smartphone"
                className="h-full w-full object-contain"
              />
            </motion.div>

            {/* =========================
                shirt
            ========================== */}
            <motion.div
              animate={{
                y: [0, 5, 0],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-8 right-4 z-30 h-28 w-35 rotate-[5deg] overflow-hidden rounded-3xl bg-white p-2 shadow-lg"
            >
              <img
                src="https://i.pinimg.com/1200x/18/8a/78/188a7865d09ddad91304b93acc941906.jpg"
                alt="Sneakers"
                className="h-full w-full rounded-2xl object-contain"
              />
            </motion.div>

            {/* =========================
                DECORATIVE DOTS
            ========================== */}
            <div className="absolute left-4 top-28 h-3 w-3 rounded-full bg-indigo-300" />

            <div className="absolute right-0 top-20 h-2 w-2 rounded-full bg-purple-300" />

            <div className="absolute bottom-2 left-10 h-3 w-3 rounded-full bg-blue-200" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;