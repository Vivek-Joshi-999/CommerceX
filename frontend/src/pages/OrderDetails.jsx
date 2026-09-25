import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CalendarDays,
  Truck,
  XCircle,
} from "lucide-react";

import {
  getOrder,
  cancelOrder,
} from "../services/orderService";

import { formatPrice } from "../utils/formatPrice";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrder(id);

        setOrder(data.order);
      } catch (error) {
        console.error(
          "Order details error:",
          error
        );

        setError(
          error.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-50 text-blue-600";

      case "shipped":
        return "bg-purple-50 text-purple-600";

      case "delivered":
        return "bg-green-50 text-green-600";

      case "cancelled":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const canCancel = (status) => {
    return (
      status !== "shipped" &&
      status !== "cancelled" &&
      status !== "delivered"
    );
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      await cancelOrder(order._id);

      setOrder((currentOrder) => ({
        ...currentOrder,
        status: "cancelled",
      }));
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message || "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafbff] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-5 w-32 rounded bg-gray-200" />

          <div className="mt-7 h-32 rounded-3xl bg-gray-200" />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="h-[500px] rounded-3xl bg-gray-200" />

            <div className="space-y-6">
              <div className="h-40 rounded-3xl bg-gray-200" />
              <div className="h-48 rounded-3xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error && !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafbff] px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Package
              size={28}
              className="text-red-500"
            />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#14245c]">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </button>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#fafbff] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </button>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Order Header */}
        <section className="mt-7 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div className="min-w-0">
              <p className="text-xs text-gray-500">
                Order ID
              </p>

              <h1 className="mt-1 break-all text-lg font-bold text-[#14245c]">
                #{order._id}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} />
                  {formatDateTime(order.createdAt)}
                </span>

                <span className="flex items-center gap-1.5">
                  <Package size={15} />
                  {order.items.length}{" "}
                  {order.items.length === 1
                    ? "item"
                    : "items"}
                </span>
              </div>
            </div>

            <span
              className={`w-fit shrink-0 rounded-full px-4 py-2 text-xs font-semibold capitalize ${getStatusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
        </section>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* Left Column */}
          <div className="space-y-6">

            {/* Order Items */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">
                <Package
                  size={20}
                  className="text-indigo-600"
                />

                <h2 className="text-lg font-bold text-[#14245c]">
                  Order Items
                </h2>
              </div>

              {/* 
                Desktop:
                - Maximum height of 520px
                - Scroll when there are many products

                Mobile:
                - No internal scroll
                - Normal page scrolling
              */}
              <div className="mt-6 max-h-none overflow-visible pr-0 divide-y divide-gray-100 lg:max-h-[520px] lg:overflow-y-auto lg:pr-2">

                {order.items.map((item, index) => (
                  <div
                    key={`${item.product}-${index}`}
                    className="flex gap-4 py-5 first:pt-0 last:pb-0"
                  >
                    {/* Product Image Placeholder */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                      <Package
                        size={25}
                        className="text-gray-400"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-[#14245c]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹{formatPrice(item.price)} each
                      </p>
                    </div>

                    {/* Item Total */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-[#14245c]">
                        ₹
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}

              </div>
            </section>

            {/* Shipping Address */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center gap-3">
                <MapPin
                  size={20}
                  className="text-indigo-600"
                />

                <h2 className="text-lg font-bold text-[#14245c]">
                  Shipping Address
                </h2>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-5">

                <p className="text-sm font-semibold text-[#14245c]">
                  {order.shippingAddress.name}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.pincode}
                </p>

                <p className="mt-3 text-sm font-medium text-gray-600">
                  Phone: {order.shippingAddress.phone}
                </p>

              </div>
            </section>
          </div>

          {/* Right Column */}
          <aside className="h-fit space-y-6">

            {/* Payment */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

              <div className="flex items-center gap-3">
                <CreditCard
                  size={20}
                  className="text-indigo-600"
                />

                <h2 className="text-lg font-bold text-[#14245c]">
                  Payment
                </h2>
              </div>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Method
                  </span>

                  <span className="text-sm font-semibold uppercase text-[#14245c]">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Payment Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

              </div>
            </section>

          {/* Order Total */}
<section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">

  <h2 className="text-lg font-bold text-[#14245c]">
    Order Summary
  </h2>

  <div className="mt-5 space-y-4">

    {/* Subtotal */}
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        Subtotal
      </span>

      <span className="text-sm font-semibold text-[#14245c]">
        ₹
        {formatPrice(
          order.totalAmount - order.shippingCharge
        )}
      </span>
    </div>

    {/* Shipping */}
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500">
        Shipping
      </span>

      {order.shippingCharge === 0 ? (
        <span className="text-sm font-semibold text-green-600">
          Free
        </span>
      ) : (
        <span className="text-sm font-semibold text-[#14245c]">
          ₹{formatPrice(order.shippingCharge)}
        </span>
      )}
    </div>

    <div className="border-t border-gray-100 pt-4">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[#14245c]">
          Total
        </span>

        <span className="text-xl font-bold text-[#14245c]">
          ₹{formatPrice(order.totalAmount)}
        </span>
      </div>
    </div>

  </div>

  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-xs text-green-600">
    <Truck size={16} />

    {order.shippingCharge === 0
      ? "Free shipping applied"
      : "Shipping included"}
  </div>

  {canCancel(order.status) && (
    <button
      type="button"
      disabled={cancelling}
      onClick={handleCancelOrder}
      className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <XCircle size={17} />

      {cancelling
        ? "Cancelling..."
        : "Cancel Order"}
    </button>
  )}

</section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;