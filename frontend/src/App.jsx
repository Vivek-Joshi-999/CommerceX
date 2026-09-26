import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./components/product/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicRoute from "./components/auth/PublicRoute";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";

import AdminRoute from "./components/auth/AdminRoute";
import AdminCustomers from "./pages/AdminCustomers";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrderDetails";
import AdminProducts from "./pages/AdminProducts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/shop" element={<Shop />} />

          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/orders/:id" element={<OrderDetails />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
