import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token) {
    return <Navigate to="/login?redirect=/admin/dashboard" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;