import { useEffect, useState } from "react";
import {
  Eye,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [sortOrder, setSortOrder] =
    useState("newest");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        setOrders(data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((order) => {
      const searchText = search
        .trim()
        .toLowerCase();

      if (!searchText) {
        return true;
      }

      const orderId =
        order._id?.toLowerCase() || "";

      const customerName =
        order.user?.name?.toLowerCase() || "";

      const customerEmail =
        order.user?.email?.toLowerCase() || "";

      return (
        orderId.includes(searchText) ||
        customerName.includes(searchText) ||
        customerEmail.includes(searchText)
      );
    })
    .filter((order) => {
      if (paymentFilter === "all") {
        return true;
      }

      return (
        order.paymentStatus === paymentFilter
      );
    })
    .filter((order) => {
      if (statusFilter === "all") {
        return true;
      }

      return order.status === statusFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt
      ).getTime();

      const dateB = new Date(
        b.createdAt
      ).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  const clearFilters = () => {
    setSearch("");
    setPaymentFilter("all");
    setStatusFilter("all");
    setSortOrder("newest");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-bold text-[#14245c]">
          Orders
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and payment status.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          {/* Search */}
          <div className="relative w-full xl:flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search order ID, customer or email..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(event) =>
              setPaymentFilter(event.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500"
          >
            <option value="all">
              All Payments
            </option>

            <option value="pending">
              Pending Payment
            </option>

            <option value="paid">
              Paid
            </option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown
              size={17}
              className="text-gray-400"
            />

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500"
            >
              <option value="newest">
                Newest first
              </option>

              <option value="oldest">
                Oldest first
              </option>
            </select>
          </div>

          {/* Clear */}
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Clear
          </button>
        </div>

        {/* Result Count */}
        <div className="mt-3 text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredOrders.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">
            {orders.length}
          </span>{" "}
          orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">
              No orders found.
            </p>
          </div>
        ) : (
          <div className="max-h-[600px] overflow-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="sticky top-0 z-10 border-b border-gray-200 bg-[#f8f9fd]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50"
                  >
                    {/* Order */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#14245c]">
                        #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </p>

                      <p className="mt-1 font-mono text-xs text-gray-400">
                        {order._id}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-800">
                        {order.user?.name ||
                          "Unknown"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.user?.email ||
                          "No email"}
                      </p>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#14245c]">
                        ₹
                        {new Intl.NumberFormat(
                          "en-IN"
                        ).format(
                          order.totalAmount
                        )}
                      </p>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          order.paymentStatus ===
                          "paid"
                            ? "bg-green-50 text-green-600"
                            : "bg-yellow-50 text-yellow-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          order.status ===
                          "delivered"
                            ? "bg-green-50 text-green-600"
                            : order.status ===
                              "cancelled"
                            ? "bg-red-50 text-red-600"
                            : order.status ===
                              "shipped"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-indigo-50 text-indigo-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order._id}`
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-[#14245c] transition hover:border-indigo-200 hover:bg-indigo-50"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;