import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  ShoppingCart,
  Truck,
  CheckCircle,
  PackageCheck,
} from "lucide-react";

import { getCart } from "../../services/cartService";
import { createOrder } from "../../services/orderService";
import { formatPrice } from "../../utils/formatPrice";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCart();

        if (
          !data.cart ||
          !data.cart.items ||
          data.cart.items.length === 0
        ) {
          navigate("/cart");
          return;
        }

        setCart(data.cart);
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error
        );

        setError(
          error.message ||
            "Failed to load your cart."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setShippingAddress((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    try {
      setPlacingOrder(true);
      setError("");

      const data = await createOrder(
        shippingAddress
      );

      setOrderSuccess(data.order);
    } catch (error) {
      console.error(
        "Failed to create order:",
        error
      );

      setError(
        error.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafbff] px-4 py-10">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-40 rounded bg-gray-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="h-[500px] rounded-3xl bg-gray-200" />

            <div className="h-80 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!cart) {
    return null;
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total +
      item.product.price * item.quantity,
    0
  );

  // Shipping policy:
  // ₹499 or more → Free shipping
  // Below ₹499 → ₹49 shipping
  const shippingCharge =
    subtotal >= 499 ? 0 : 49;

  const total = subtotal + shippingCharge;

  const amountForFreeShipping =
    Math.max(499 - subtotal, 0);

  /*
   * Order success screen
   */
  if (orderSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafbff] px-4 py-10">
        <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">

          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <PackageCheck
              size={42}
              className="text-green-600"
              strokeWidth={1.8}
            />
          </div>

          {/* Success Message */}
          <h1 className="mt-6 text-2xl font-bold text-[#14245c]">
            Order Placed Successfully!
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Thank you for your order. Your order
            has been confirmed and will be processed
            shortly.
          </p>

          {/* Order Information */}
          <div className="mt-7 rounded-2xl bg-gray-50 p-5 text-left">

            {/* Order ID */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Order ID
              </span>

              <span className="break-all text-right text-sm font-semibold text-[#14245c]">
                #{orderSuccess._id}
              </span>
            </div>

            {/* Payment */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Payment
              </span>

              <span className="text-sm font-semibold uppercase text-[#14245c]">
                {orderSuccess.paymentMethod}
              </span>
            </div>

            {/* Total */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total
              </span>

              <span className="text-lg font-bold text-[#14245c]">
                ₹
                {formatPrice(
                  orderSuccess.totalAmount
                )}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/orders/${orderSuccess._id}`
                )
              }
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              View Order
            </button>

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-[#14245c] transition-colors hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#14245c]">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your shipping details and place
            your order.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

            {/* Shipping Address */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <MapPin
                    size={20}
                    className="text-indigo-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#14245c]">
                    Shipping Address
                  </h2>

                  <p className="text-xs text-gray-500">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleChange}
                    required
                    placeholder="Enter pincode"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="House number, street, area"
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter city"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#14245c]">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter state"
                    className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* Order Summary */}
            <aside className="h-fit rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <ShoppingCart
                  size={20}
                  className="text-indigo-600"
                />

                <h2 className="text-lg font-bold text-[#14245c]">
                  Order Summary
                </h2>
              </div>

              {/* Items */}
              <div className="mt-6 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-3"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-[#14245c]">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#14245c]">
                      ₹
                      {formatPrice(
                        item.product.price *
                          item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 h-px bg-gray-200" />

              {/* Subtotal */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="font-semibold text-[#14245c]">
                  ₹{formatPrice(subtotal)}
                </span>
              </div>

              {/* Shipping */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500">
                  <Truck size={16} />
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

              <div className="my-6 h-px bg-gray-200" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#14245c]">
                  Total
                </span>

                <span className="text-xl font-bold text-[#14245c]">
                  ₹{formatPrice(total)}
                </span>
              </div>

              {/* Payment */}
              <div className="mt-5 rounded-xl bg-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#14245c]">
                      Cash on Delivery
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Pay when your order is delivered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order */}
              <button
                type="submit"
                disabled={placingOrder}
                className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;