import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Users,
  Package,
  IndianRupee,
} from "lucide-react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load dashboard"
          );
        }

        setStats(data.stats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard...
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

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
    },
    {
      title: "Total Revenue",
      value: `₹${new Intl.NumberFormat("en-IN").format(
        stats.totalRevenue
      )}`,
      icon: IndianRupee,
    },
  ];

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-[#14245c]">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your CommerceX store.
        </p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                  <Icon size={20} />
                </div>
              </div>

              <p className="mt-4 text-2xl font-bold text-[#14245c]">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#14245c]">
          Order Status
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatusCard
            label="Pending"
            value={stats.orders.pending}
          />

          <StatusCard
            label="Confirmed"
            value={stats.orders.confirmed}
          />

          <StatusCard
            label="Shipped"
            value={stats.orders.shipped}
          />

          <StatusCard
            label="Delivered"
            value={stats.orders.delivered}
          />

          <StatusCard
            label="Cancelled"
            value={stats.orders.cancelled}
          />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="rounded-lg bg-[#f8f9fd] p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-semibold text-[#14245c]">
        {value}
      </p>
    </div>
  );
}

export default AdminDashboard;