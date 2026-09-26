import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
} from "lucide-react";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#14245c] text-white">
          <div className="border-b border-white/10 px-6 py-5">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2"
            >
              <img
                src="src/icon.png"
                alt="CommerceX"
                className="h-8 w-8 object-contain"
              />

              <div>
                <p className="font-bold">
                  CommerceX
                </p>

                <p className="text-xs text-indigo-200">
                  Admin Panel
                </p>
              </div>
            </Link>
          </div>

          <nav className="px-3 py-5">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/admin/orders"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <ShoppingBag size={18} />
              Orders
            </Link>

            <Link
              to="/admin/products"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <Package size={18} />
              Products
            </Link>

            <Link
              to="/admin/customers"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <Users size={18} />
              Customers
            </Link>

            <button
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-indigo-100 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="border-b border-gray-200 bg-white px-6 py-4">
            <h1 className="text-lg font-semibold text-[#14245c]">
              Admin Panel
            </h1>
          </div>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;