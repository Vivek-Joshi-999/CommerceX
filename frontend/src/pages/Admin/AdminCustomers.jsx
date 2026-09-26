import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  ArrowUpDown,
} from "lucide-react";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [sortOrder, setSortOrder] =
    useState("newest");

  const [deletingCustomer, setDeletingCustomer] =
    useState(null);

  const token = localStorage.getItem("token");

  // ============================================
  // FETCH CUSTOMERS
  // ============================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch customers"
        );
      }

      setCustomers(data.customers);
    } catch (error) {
      console.error(
        "Failed to fetch customers:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ============================================
  // DELETE CUSTOMER
  // ============================================

  const handleDeleteCustomer = async () => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/admin/customers/${deletingCustomer._id}`,
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
          data.message || "Failed to delete customer"
        );
      }

      setCustomers((previous) =>
        previous.filter(
          (customer) =>
            customer._id !== deletingCustomer._id
        )
      );

      setDeletingCustomer(null);
    } catch (error) {
      console.error(
        "Failed to delete customer:",
        error
      );

      setError(error.message);
    }
  };

  // ============================================
  // SEARCH
  // ============================================

  const filteredCustomers = customers
    .filter((customer) => {
      const searchText = search
        .trim()
        .toLowerCase();

      if (!searchText) {
        return true;
      }

      return (
        customer.name
          .toLowerCase()
          .includes(searchText) ||
        customer.email
          .toLowerCase()
          .includes(searchText) ||
        customer._id
          .toLowerCase()
          .includes(searchText)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    });

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading customers...
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#14245c]">
          Customers
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage registered customers
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Search + Sort */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
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
            placeholder="Search name, email or ID..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Count */}
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredCustomers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {customers.length}
            </span>
          </p>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown
              size={16}
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
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Email
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Role
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Joined
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(
                  (customer) => (
                    <tr
                      key={customer._id}
                      className="hover:bg-gray-50"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#14245c]">
                          {customer.name}
                        </p>
                      </td>

                      {/* FULL CUSTOMER ID */}
                      <td className="px-5 py-4">
                        <span className="whitespace-nowrap font-mono text-xs text-gray-500">
                          {customer._id}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {customer.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                          {customer.role}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {customer.createdAt
                          ? new Date(
                              customer.createdAt
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      {/* Delete */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setDeletingCustomer(
                                customer
                              )
                            }
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            title="Delete customer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================
          DELETE CONFIRMATION MODAL
      ======================================== */}

      {deletingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#14245c]">
              Delete Customer
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-700">
                {deletingCustomer.name}
              </span>
              ?
            </p>

            <p className="mt-1 text-sm text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingCustomer(null)
                }
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCustomer}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCustomers;