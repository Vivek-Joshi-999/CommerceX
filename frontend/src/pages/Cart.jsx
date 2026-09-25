import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
} from "../services/guestCartService";

import { formatPrice } from "../utils/formatPrice";

const API_URL = "http://localhost:5000/api/cart";

const getToken = () => {
  return localStorage.getItem("token");
};

const getUserCart = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to load cart"
    );
  }

  return data.cart?.items || [];
};

const updateUserCartItem = async (
  productId,
  quantity
) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update cart"
    );
  }

  return data.cart.items;
};

const removeUserCartItem = async (productId) => {
  const token = getToken();

  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to remove item"
    );
  }

  return data.cart.items;
};

const clearUserCart = async () => {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to clear cart"
    );
  }

  return data;
};

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const [error, setError] = useState("");

  const isLoggedIn = Boolean(getToken());

  // Load correct cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        if (getToken()) {
          // Logged-in user → MongoDB cart
          const userCart = await getUserCart();

          setCart(userCart);
        } else {
          // Guest → localStorage cart
          const guestCart = getGuestCart();

          setCart(guestCart);
        }
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setError(
          error.message || "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleIncrease = async (productId) => {
    const item = cart.find(
      (item) => item.product._id === productId
    );

    if (!item) return;

    try {
      setActionLoading(true);

      if (isLoggedIn) {
        // MongoDB cart
        const updatedCart =
          await updateUserCartItem(
            productId,
            item.quantity + 1
          );

        setCart(updatedCart);
      } else {
        // Guest cart
        const updatedCart =
          updateGuestCartItem(
            productId,
            item.quantity + 1
          );

        setCart(updatedCart);
      }
    } catch (error) {
      setError(
        error.message || "Failed to update cart"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecrease = async (productId) => {
    const item = cart.find(
      (item) => item.product._id === productId
    );

    if (!item) return;

    try {
      setActionLoading(true);

      if (item.quantity === 1) {
        if (isLoggedIn) {
          const updatedCart =
            await removeUserCartItem(productId);

          setCart(updatedCart);
        } else {
          const updatedCart =
            removeFromGuestCart(productId);

          setCart(updatedCart);
        }

        return;
      }

      if (isLoggedIn) {
        const updatedCart =
          await updateUserCartItem(
            productId,
            item.quantity - 1
          );

        setCart(updatedCart);
      } else {
        const updatedCart =
          updateGuestCartItem(
            productId,
            item.quantity - 1
          );

        setCart(updatedCart);
      }
    } catch (error) {
      setError(
        error.message || "Failed to update cart"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setActionLoading(true);

      if (isLoggedIn) {
        const updatedCart =
          await removeUserCartItem(productId);

        setCart(updatedCart);
      } else {
        const updatedCart =
          removeFromGuestCart(productId);

        setCart(updatedCart);
      }
    } catch (error) {
      setError(
        error.message || "Failed to remove item"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setActionLoading(true);

      if (isLoggedIn) {
        await clearUserCart();

        setCart([]);
      } else {
        clearGuestCart();

        setCart([]);
      }
    } catch (error) {
      setError(
        error.message || "Failed to clear cart"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!getToken()) {
      setShowLoginPopup(true);
      return;
    }

    navigate("/checkout");
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  // Shipping policy
  const shippingCharge =
    subtotal >= 499 ? 0 : 49;

  const total = subtotal + shippingCharge;

  const amountForFreeShipping =
    Math.max(499 - subtotal, 0);

  // Loading
  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2
            size={28}
            className="animate-spin text-indigo-600"
          />
        </div>
      </section>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-[#14245c]">
            Your cart is empty
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add some products to your cart and they
            will appear here.
          </p>

          <Link
            to="/shop"
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">
              Login Required
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Please login to continue with checkout.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowLoginPopup(false)
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#14245c]">
            Shopping Cart
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {cart.length}{" "}
            {cart.length === 1
              ? "item"
              : "items"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          disabled={actionLoading}
          className="text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Content */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

        {/* Cart Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              {/* Product Image */}
              <Link
                to={`/product/${item.product._id}`}
                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-50"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              {/* Product Details */}
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-indigo-600">
                    {item.product.category}
                  </p>

                  <Link
                    to={`/product/${item.product._id}`}
                    className="mt-1 block text-sm font-semibold text-[#14245c] hover:text-indigo-600"
                  >
                    {item.product.name}
                  </Link>

                  <p className="mt-1 text-sm font-bold text-[#14245c]">
                    ₹{formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Quantity + Remove */}
                <div className="mt-3 flex items-center justify-between">

                  {/* Quantity */}
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button
                      type="button"
                      onClick={() =>
                        handleDecrease(
                          item.product._id
                        )
                      }
                      disabled={actionLoading}
                      className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-8 text-center text-sm font-medium text-gray-700">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleIncrease(
                          item.product._id
                        )
                      }
                      disabled={actionLoading}
                      className="flex h-8 w-8 items-center justify-center text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(
                        item.product._id
                      )
                    }
                    disabled={actionLoading}
                    className="flex items-center gap-1 text-xs font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#14245c]">
            Order Summary
          </h2>

          {/* Subtotal */}
          <div className="mt-6 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Subtotal
            </span>

            <span className="font-semibold text-[#14245c]">
              ₹{formatPrice(subtotal)}
            </span>
          </div>

          {/* Shipping */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Shipping
            </span>

            {shippingCharge === 0 ? (
              <span className="font-semibold text-green-600">
                Free
              </span>
            ) : (
              <span className="font-semibold text-[#14245c]">
                ₹{formatPrice(shippingCharge)}
              </span>
            )}
          </div>

          {/* Free Shipping Message */}
          {subtotal < 499 && (
            <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs leading-5 text-indigo-600">
              Add ₹
              {formatPrice(
                amountForFreeShipping
              )}{" "}
              more to get free shipping.
            </p>
          )}

          {subtotal >= 499 && (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-600">
              You qualify for free shipping!
            </p>
          )}

          <div className="my-5 border-t border-gray-100" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#14245c]">
              Total
            </span>

            <span className="text-xl font-bold text-[#14245c]">
              ₹{formatPrice(total)}
            </span>
          </div>

          {/* Checkout */}
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Cart;