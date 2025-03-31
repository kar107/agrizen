import axios from "axios";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [formData, setFormData] = useState<{
    id: number | null;
    name: string;
    description: string;
    category_id: number | "";
    price: number | "";
    stock_quantity: number | "";
    unit: string;
    status: string;
    user_id: number | null;
  }>({
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

  const API_URL =
    "http://localhost/agrizen/backend/adminController/productController.php";
  const CATEGORY_API_URL =
    "http://localhost/agrizen/backend/adminController/categoryController.php";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products", error);
      setError("Failed to fetch products. Please check API connection.");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    let userId = userData?.userid || null;

    // Ensure `user_id` is included in formData before submission
    const updatedFormData = { ...formData, user_id: userId };

    console.log("Submitting formData:", updatedFormData); // Debugging Log

    try {
      let response;
      if (editing) {
        response = await axios.put(API_URL, JSON.stringify(updatedFormData), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(API_URL, JSON.stringify(updatedFormData), {
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("Server Response:", response.data);

      if (response.data.status === 200) {
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
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setError("Error processing request. Please try again.");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({ ...product });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${API_URL}?id=${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product", error);
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
                {/* <th className="border p-2">Status</th> */}
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border">
                  <td className="border p-2">{product.id}</td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">${product.price}</td>
                  {/* <td className="border p-2">
                    <span
                      className={
                        product.status === "active"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {product.status}
                    </span>
                  </td> */}
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
