import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function AdminOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  // Custom popup state
  const [popup, setPopup] = useState({
    show: false,
    type: "success",
    title: "",
    message: "",
    orderStatus: "",
    paymentStatus: "",
  });

  // =====================================================
  // POPUP FUNCTIONS
  // =====================================================

  const showPopup = ({
    type = "success",
    title,
    message,
    orderStatus,
    paymentStatus,
  }) => {
    setPopup({
      show: true,
      type,
      title,
      message,
      orderStatus,
      paymentStatus,
    });
  };

  const closePopup = () => {
    setPopup((previous) => ({
      ...previous,
      show: false,
    }));
  };

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/admin/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load order");
        }

        setOrder(data.order);
        setStatus(data.order.status);
        setPaymentStatus(data.order.paymentStatus);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async () => {
    try {
      setError("");

      // Prevent changing order status after payment
      // has already been marked as paid.
      if (order?.paymentStatus === "paid") {
        showPopup({
          type: "error",
          title: "Status Locked",
          message:
            "Order status cannot be changed after payment is marked as paid.",
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
        });

        return;
      }

      // Do nothing if selected status is already current status
      if (status === order?.status) {
        showPopup({
          type: "error",
          title: "No Change",
          message: "The order is already using this status.",
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
        });

        return;
      }

      setUpdatingStatus(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      // Update complete order object
      setOrder(data.order);

      // Keep both states synchronized
      setStatus(data.order.status);
      setPaymentStatus(data.order.paymentStatus);

      // Show success popup
      showPopup({
        type: "success",
        title: "Order Updated",
        message: "The order status was updated successfully.",
        orderStatus: data.order.status,
        paymentStatus: data.order.paymentStatus,
      });
    } catch (error) {
      setError(error.message);

      showPopup({
        type: "error",
        title: "Update Failed",
        message: error.message,
        orderStatus: order?.status || status,
        paymentStatus: order?.paymentStatus || paymentStatus,
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // UPDATE PAYMENT STATUS
  // =====================================================

  const updatePaymentStatus = async () => {
    try {
      setError("");

      // Prevent changing payment after it is paid
      if (order?.paymentStatus === "paid") {
        showPopup({
          type: "error",
          title: "Payment Locked",
          message:
            "Payment status cannot be changed after payment is marked as paid.",
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
        });

        return;
      }

      // Do nothing if selected payment status is
      // already the current payment status.
      if (paymentStatus === order?.paymentStatus) {
        showPopup({
          type: "error",
          title: "No Change",
          message: "The payment is already using this status.",
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
        });

        return;
      }

      // Payment can only become paid after delivery.
      if (paymentStatus === "paid" && order?.status !== "delivered") {
        showPopup({
          type: "error",
          title: "Payment Not Allowed",
          message:
            "Payment can only be marked as paid after the order is delivered.",
          orderStatus: order.status,
          paymentStatus: order.paymentStatus,
        });

        return;
      }

      setUpdatingPayment(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${id}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update payment status");
      }

      // Update complete order object
      setOrder(data.order);

      // Keep both states synchronized
      setStatus(data.order.status);
      setPaymentStatus(data.order.paymentStatus);

      // Show success popup
      showPopup({
        type: "success",
        title: "Payment Updated",
        message: "The payment status was updated successfully.",
        orderStatus: data.order.status,
        paymentStatus: data.order.paymentStatus,
      });
    } catch (error) {
      setError(error.message);

      showPopup({
        type: "error",
        title: "Update Failed",
        message: error.message,
        orderStatus: order?.status || status,
        paymentStatus: order?.paymentStatus || paymentStatus,
      });
    } finally {
      setUpdatingPayment(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">Loading order...</p>
      </div>
    );
  }

  // =====================================================
  // FULL PAGE ERROR
  // =====================================================

  if (error && !order) {
    return (
      <div>
        <button
          type="button"
          onClick={() => navigate("/admin/orders")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-600">
          <ArrowLeft size={16} />
          Back to Orders
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div>
      {/* =================================================
          CUSTOM POPUP
      ================================================= */}

      {popup.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  popup.type === "success" ? "bg-green-100" : "bg-red-100"
                }`}>
                {popup.type === "success" ? (
                  <svg
                    className="h-7 w-7 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-7 w-7 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-center text-lg font-bold text-[#14245c]">
              {popup.title}
            </h3>

            {/* Message */}
            <p className="mt-2 text-center text-sm text-gray-500">
              {popup.message}
            </p>

            {/* Status Summary */}
            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              {/* Order Status */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Order Status</span>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {popup.orderStatus}
                </span>
              </div>

              {/* Payment Status */}
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Payment Status</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    popup.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {popup.paymentStatus}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closePopup}
              className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                popup.type === "success"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}>
              Done
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          BACK BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() => navigate("/admin/orders")}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#14245c]">
        <ArrowLeft size={17} />
        Back to Orders
      </button>

      {/* =================================================
          HEADING
      ================================================= */}

      <div className="mt-5">
        <h2 className="text-2xl font-bold text-[#14245c]">Order Details</h2>

        <p className="mt-1 text-sm text-gray-500">
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
      </div>

      {/* Inline Error */}
      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* =================================================
            LEFT
        ================================================= */}

        <div className="space-y-6 lg:col-span-2">
          {/* =================================================
              CUSTOMER
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#14245c]">Customer</h3>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Name</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {order.user?.name || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Email</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {order.user?.email || "No email"}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              SHIPPING
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#14245c]">
              Shipping Address
            </h3>

            <div className="mt-4 space-y-1 text-sm leading-6 text-gray-600">
              <p>
                <span className="font-medium text-gray-800">
                  {order.shippingAddress?.name}
                </span>
              </p>

              <p>{order.shippingAddress?.phone}</p>

              <p>{order.shippingAddress?.address}</p>

              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.pincode}
              </p>
            </div>
          </div>

          {/* =================================================
              ORDER ITEMS
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <h3 className="text-base font-semibold text-[#14245c]">
                Order Items
              </h3>
            </div>

            <div className="max-h-[400px] overflow-auto">
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-800">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        ₹{new Intl.NumberFormat("en-IN").format(item.price)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold text-[#14245c]">
                      ₹
                      {new Intl.NumberFormat("en-IN").format(
                        item.price * item.quantity,
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                TOTALS
            ================================================= */}

            <div className="border-t border-gray-200 p-6">
              <div className="space-y-3 text-sm">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>

                  <span className="font-medium text-gray-800">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      order.items.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      ),
                    )}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>

                  <span className="font-medium text-gray-800">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      order.shippingCharge || 0,
                    )}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between border-t border-gray-200 pt-3">
                  <span className="font-semibold text-[#14245c]">Total</span>

                  <span className="font-bold text-[#14245c]">
                    ₹{new Intl.NumberFormat("en-IN").format(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="space-y-6">
          {/* =================================================
              ORDER INFORMATION
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#14245c]">
              Order Information
            </h3>

            <div className="mt-4 space-y-4">
              {/* Order Date */}
              <div>
                <p className="text-xs text-gray-500">Order Date</p>

                <p className="mt-1 text-sm text-gray-800">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-xs text-gray-500">Payment Method</p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {order.paymentMethod}
                </p>
              </div>

              {/* Current Order Status */}
              <div>
                <p className="text-xs text-gray-500">Current Order Status</p>

                <p className="mt-1 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold capitalize text-indigo-700">
                  {order.status}
                </p>
              </div>

              {/* Current Payment Status */}
              <div>
                <p className="text-xs text-gray-500">Current Payment Status</p>

                <p
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              UPDATE ORDER STATUS
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#14245c]">
              Order Status
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Current status:{" "}
              <span className="font-semibold capitalize text-indigo-600">
                {order.status}
              </span>
            </p>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={order?.paymentStatus === "paid" || updatingStatus}
              className="mt-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100">
              <option value="pending">Pending</option>

              <option value="confirmed">Confirmed</option>

              <option value="shipped">Shipped</option>

              <option value="delivered">Delivered</option>

              <option value="cancelled">Cancelled</option>
            </select>

            {order?.paymentStatus === "paid" && (
              <p className="mt-2 text-xs text-red-600">
                Order status is locked because payment has already been marked
                as paid.
              </p>
            )}

            <button
              type="button"
              onClick={updateOrderStatus}
              disabled={updatingStatus || order?.paymentStatus === "paid"}
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {updatingStatus
                ? "Updating..."
                : order?.paymentStatus === "paid"
                  ? "Status Locked"
                  : "Update Order Status"}
            </button>
          </div>

          {/* =================================================
              PAYMENT STATUS
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-[#14245c]">
              Payment Status
            </h3>

            <p className="mt-2 text-xs text-gray-500">
              Current status:{" "}
              <span
                className={`font-semibold capitalize ${
                  order.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}>
                {order.paymentStatus}
              </span>
            </p>

            <select
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value)}
              disabled={
                order?.paymentStatus === "paid" ||
                order?.status !== "delivered" ||
                updatingPayment
              }
              className="mt-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100">
              <option value="pending">Pending</option>

              <option value="paid" disabled={order?.status !== "delivered"}>
                Paid
              </option>
            </select>

            {/* Before delivery */}
            {order?.status !== "delivered" &&
              order?.paymentStatus !== "paid" && (
                <p className="mt-2 text-xs text-orange-600">
                  Payment can only be marked as paid after delivery.
                </p>
              )}

            {/* Already paid */}
            {order?.paymentStatus === "paid" && (
              <p className="mt-2 text-xs text-green-600">
                Payment is completed. Payment and order status are now locked.
              </p>
            )}

            <button
              type="button"
              onClick={updatePaymentStatus}
              disabled={
                updatingPayment ||
                order?.paymentStatus === "paid" ||
                order?.status !== "delivered"
              }
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
              {updatingPayment
                ? "Updating..."
                : order?.paymentStatus === "paid"
                  ? "Payment Locked"
                  : order?.status !== "delivered"
                    ? "Available After Delivery"
                    : "Update Payment Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;
