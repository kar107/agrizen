import { useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import AddToCart from "./pages/AddToCart";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Register from "./pages/Register";
import Services from "./pages/Services";
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import CategoryManagement from "./pages/admin/categories";
import ProductManagement from "./pages/admin/products";
import ProfileManagement from "./pages/admin/profile";
import LoginPage from "./pages/login";
import ProductSingle from "./pages/productsingle";
import SupplierDashboard from "./pages/supplier/Dashboard";
import SupplierCategoryManagement from "./pages/supplier/categories";
import SupplierProductManagement from "./pages/supplier/products";
import SupplierProfileManagement from "./pages/supplier/profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/userorders";
import AdminOrders from "./pages/admin/Orders";
import SupplierOrders from "./pages/supplier/orders";// ✅ NEW IMPORT

function Layout() {
  const location = useLocation();
  const hideNavbarFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/supplier");

  const [cart_count, setCount] = useState(localStorage.getItem("Cart_count") || 0);
  const [flag, setflag] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbarFooter && <Navbar flag={flag} setflag={setflag} cart_count={cart_count} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} /> {/* ✅ NEW ROUTE */}
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<LoginPage setflag={setflag} flag={flag} />}
          />
          <Route path="/admin/UserManagement" element={<UserManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/profile" element={<ProfileManagement />} />
          <Route
            path="/supplier/categories"
            element={<SupplierCategoryManagement />}
          />
          <Route
            path="/supplier/products"
            element={<SupplierProductManagement />}
          />
          <Route
            path="/supplier/profile"
            element={<SupplierProfileManagement />}
          />
          <Route path="/productsingle/:id" element={<ProductSingle />} />
          <Route path="/cart" element={<AddToCart cart_count={cart_count} setCount={setCount} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/supplier/orders" element={<SupplierOrders />} />


        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
