import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { loginUser } from "../services/authService";
import { mergeGuestCart } from "../services/cartService";
import {
  getGuestCart,
  clearGuestCart,
} from "../services/guestCartService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleLogin = async () => {
    setMessage({
      type: "",
      text: "",
    });

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setMessage({
        type: "error",
        text: "Please enter your email and password.",
      });

      return;
    }

    try {
      setLoading(true);

      // Login user
      const data = await loginUser(
        trimmedEmail,
        password
      );

      console.log("Login successful:", data);

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Get guest cart
      const guestCart = getGuestCart();

      // Merge guest cart into user's MongoDB cart
      if (guestCart.length > 0) {
        const items = guestCart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        }));

        await mergeGuestCart(items);

        // Clear guest cart only after successful merge
        clearGuestCart();
      }

      // Notify Navbar that authentication changed
      window.dispatchEvent(new Event("authChange"));

      setMessage({
        type: "success",
        text: "Login successful!",
      });

      const searchParams = new URLSearchParams(
        location.search
      );

      const redirect = searchParams.get("redirect");

      setTimeout(() => {
        navigate(redirect || "/");
      }, 800);
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message ||
          "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f8f9fd] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#14245c]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Login to continue shopping with CommerceX
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mt-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <XCircle size={18} />
            )}

            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <div className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#14245c]">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#14245c]">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
            />
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-slate-500">
          New user?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;