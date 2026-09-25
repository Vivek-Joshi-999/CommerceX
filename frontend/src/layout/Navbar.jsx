import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/shop");
      return;
    }

    navigate(
      `/shop?search=${encodeURIComponent(trimmedSearch)}`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChange"));

    setIsMenuOpen(false);

    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-5 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-indigo-600"
        : "text-[#14245c] hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2"
        >
                <img
  src="src/icon.png"
  alt="CommerceX"
  className="h-12 w-12 object-contain"
/>

          <span className="text-lg font-bold tracking-tight text-[#14245c]">
            CommerceX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="ml-12 hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Home

                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/shop"
            className={navLinkClass}
          >
            {({ isActive }) => (
              <>
                Shop

                {isActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-indigo-500"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Desktop Right Section */}
        <div className="ml-auto hidden items-center gap-3 md:flex">

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="group flex h-10 w-64 items-center rounded-full border border-gray-200 bg-[#f8f9fd] px-4 transition-all duration-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100"
          >
            <Search
              size={17}
              strokeWidth={2}
              className="mr-2 shrink-0 text-gray-400 transition-colors duration-200 group-focus-within:text-indigo-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search products..."
              className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="ml-2 flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </form>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#14245c] transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <ShoppingCart
              size={20}
              strokeWidth={1.8}
            />
          </Link>

          {/* Logged In */}
          {isLoggedIn ? (
            <div className="group relative">

              {/* Profile Button */}
              <button
                type="button"
                aria-label="Profile menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#14245c] transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <User
                  size={20}
                  strokeWidth={1.8}
                />
              </button>

              {/* Profile Dropdown */}
              <div className="invisible absolute right-0 top-full z-50 w-44 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

                  {/* My Orders */}
                  <Link
                    to="/orders"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    My Orders
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>

                </div>
              </div>
            </div>
          ) : (
            /* Logged Out */
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-[#14245c] transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-4">

              {/* Mobile Search */}
              <form
                onSubmit={(event) => {
                  handleSearch(event);
                  setIsMenuOpen(false);
                }}
                className="group mb-4 flex h-11 items-center rounded-lg border border-gray-200 bg-[#f8f9fd] px-3 transition-all duration-200 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100"
              >
                <Search
                  size={17}
                  className="mr-2 shrink-0 text-gray-400 group-focus-within:text-indigo-500"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search products..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />

                {search.trim() && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Home */}
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-[#14245c] hover:bg-indigo-50"
                  }`
                }
              >
                Home
              </NavLink>

              {/* Shop */}
              <NavLink
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-[#14245c] hover:bg-indigo-50"
                  }`
                }
              >
                Shop
              </NavLink>

              {/* Cart */}
              <Link
                to="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#14245c] hover:bg-indigo-50"
              >
                <ShoppingCart size={18} />
                Cart
              </Link>

              {/* Logged In Mobile */}
              {isLoggedIn ? (
                <>
                  {/* My Orders */}
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#14245c] hover:bg-indigo-50"
                  >
                    My Orders
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#14245c] hover:bg-indigo-50"
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                /* Logged Out Mobile */
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/register");
                    }}
                    className="w-full rounded-lg bg-indigo-600 px-3 py-2.5 text-left text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Sign Up
                  </button>
                </>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;