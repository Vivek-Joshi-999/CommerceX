import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const handleRegister = async () => {
    setMessage({
      type: "",
      text: "",
    });

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields.",
      });

      return;
    }

    if (password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });

      return;
    }

    try {
      setLoading(true);

      const data = await registerUser(
        trimmedName,
        trimmedEmail,
        password
      );

      console.log("Registration successful:", data);

      setMessage({
        type: "success",
        text: "Account created successfully!",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Registration failed.",
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
            Create Account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join CommerceX and start shopping
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

          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#14245c]">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#14245c]">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              minLength={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-50"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Minimum 8 characters
            </p>
          </div>

          {/* Create Account */}
          <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />

                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;