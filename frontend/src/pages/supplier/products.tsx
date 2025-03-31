import axios from "axios";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  price: number;
  stock_quantity: number;
  unit: string;
  status: string;
  created_at: string;
  user_id: number;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    category_id: "",
    price: "",
    stock_quantity: "",
    unit: "",
    status: "active",
    user_id: null,
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost/agrizen/backend/adminController/productController.php";
  const CATEGORY_API_URL = "http://localhost/agrizen/backend/adminController/categoryController.php";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = userData?.userid || null;
  
      if (!userId) {
        console.error("User ID not found.");
        return;
      }
  
      const response = await axios.get(`${API_URL}?user_id=${userId}`);
      
      // If the API doesn't filter, filter the response manually
      const filteredProducts = response.data.data.filter(product => product.user_id === userId);
  
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch products. Please check API connection.',
      });
    }
  };
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    let userId = userData?.userid || null;

    try {
      let response;
      if (editing) {
        response = await axios.put(API_URL, JSON.stringify({ ...formData, user_id: userId }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(API_URL, JSON.stringify({ ...formData, user_id: userId }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editing ? 'Product updated successfully!' : 'Product added successfully!',
        });
        fetchProducts();
        setEditing(false);
        setFormData({
          id: null,
          name: "",
          description: "",
          category_id: "",
          price: "",
          stock_quantity: "",
          unit: "",
          status: "active",
          user_id: userId,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.message || 'Something went wrong!',
        });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error processing request. Please try again.',
      });
    }
  };

  const handleEdit = (product) => {
    setFormData({ ...product });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}?id=${id}`);
        Swal.fire(
          'Deleted!',
          'Your product has been deleted.',
          'success'
        );
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete product',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="supplier" />
      <div className="flex-1 ml-[280px] p-6">
        <h1 className="text-3xl font-bold mb-4">Product Management</h1>

        {/* Form */}
        <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            {editing ? "Update" : "Add"} Product
          </button>
        </form>

        {/* Product List */}
        <div className="mt-6 bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border">
                  <td className="border p-2">{product.id}</td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;