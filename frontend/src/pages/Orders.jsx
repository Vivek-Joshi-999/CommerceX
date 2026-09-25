import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CalendarDays,
  CreditCard,
  ChevronRight,
  XCircle,
} from "lucide-react";

import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

import { formatPrice } from "../utils/formatPrice";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        setOrders(data.orders);
      } catch (error) {
        console.error("Orders error:", error);

        setError(
          error.message || "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingId(orderId);
      setError("");

      await cancelOrder(orderId);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: "cancelled",
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message || "Failed to cancel order"
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#14245c]">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your orders
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Empty Orders */}
      {orders.length === 0 ? (
        <div className="mt-8 flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 text-center shadow-sm">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
            <Package
              size={30}
              className="text-indigo-600"
              strokeWidth={1.7}
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-[#14245c]">
            No orders yet
          </h2>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            You haven't placed any orders yet.
            Start shopping to see your orders here.
          </p>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >

              {/* Order Header */}
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs text-gray-500">
                      Order ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-[#14245c]">
                      #{order._id}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Information */}
              <div className="px-5 py-5 sm:px-6">

                <div className="grid gap-4 sm:grid-cols-3">

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      <CalendarDays
                        size={18}
                        className="text-indigo-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Ordered On
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#14245c]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      <Package
                        size={18}
                        className="text-indigo-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Items
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#14245c]">
                        {order.items.length}{" "}
                        {order.items.length === 1
                          ? "item"
                          : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Order Total */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                      <CreditCard
                        size={18}
                        className="text-indigo-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Order Total
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#14245c]">
                        ₹{formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5">
                  <span className="text-xs text-gray-500">
                    Payment:
                  </span>

                  <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium uppercase text-gray-600">
                    {order.paymentMethod}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      order.paymentStatus === "paid"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/orders/${order._id}`)
                    }
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </button>

                  {canCancel(order.status) && (
                    <button
                      type="button"
                      disabled={
                        cancellingId === order._id
                      }
                      onClick={() =>
                        handleCancelOrder(order._id)
                      }
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={16} />

                      {cancellingId === order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Orders;