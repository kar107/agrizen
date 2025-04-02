import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Marketplace from './pages/Marketplace';
import AdminDashboard from './pages/admin/Dashboard';
import SupplierDashboard from './pages/supplier/Dashboard';
import Register from './pages/Register';
import LoginPage from './pages/login';
import UserManagement from './pages/admin/UserManagement';
import CategoryManagement from './pages/admin/categories';
import ProductManagement from './pages/admin/products';
import ProfileManagement from './pages/admin/profile';
import SupplierCategoryManagement from './pages/supplier/categories';
import SupplierProductManagement from './pages/supplier/products';
import SupplierProfileManagement from './pages/supplier/profile';



function Layout() {
  const location = useLocation();
  const hideNavbarFooter = location.pathname.startsWith('/admin') || location.pathname.startsWith('/supplier');

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/UserManagement" element={<UserManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/profile" element={<ProfileManagement />} />
          <Route path="/supplier/categories" element={<SupplierCategoryManagement />} />
          <Route path="/supplier/products" element={<SupplierProductManagement />} />
          <Route path="/supplier/profile" element={<SupplierProfileManagement />} />
          

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
