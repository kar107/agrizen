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
  image: string;
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
    image: null as File | null,
    existingImage: ""
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
      const filteredProducts = response.data.data.filter((product: Product) => product.user_id === userId);
  
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.userid || null;

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id?.toString() || "");
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category_id", formData.category_id.toString());
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("stock_quantity", formData.stock_quantity.toString());
    formDataToSend.append("unit", formData.unit);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("user_id", userId?.toString() || "");
    
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    if (editing && formData.existingImage) {
      formDataToSend.append("existingImage", formData.existingImage);
    }

    try {
      let response;
      if (editing) {
        response = await axios.put(API_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post(API_URL, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
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
          image: null,
          existingImage: ""
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

  const handleEdit = (product: Product) => {
    setFormData({ 
      ...product, 
      category_id: product.category_id,
      price: product.price,
      stock_quantity: product.stock_quantity,
      image: null,
      existingImage: product.image || ""
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
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
            <input
              type="number"
              name="stock_quantity"
              placeholder="Stock Quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="text"
              name="unit"
              placeholder="Unit (kg, g, etc.)"
              value={formData.unit}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <div className="col-span-2">
              <label className="block mb-2">Product Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="border p-2 rounded"
                accept="image/*"
              />
              {editing && formData.existingImage && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Image:</p>
                  <img 
                    src={`http://localhost/agrizen/backend/uploads/products/${formData.existingImage}`} 
                    alt="Product" 
                    className="h-20 w-20 object-cover mt-1"
                  />
                </div>
              )}
            </div>
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
                <th className="border p-2">Image</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border">
                  <td className="border p-2">{product.id}</td>
                  <td className="border p-2">
                    {product.image && (
                      <img 
                        src={`http://localhost/agrizen/backend/uploads/products/${product.image}`} 
                        alt={product.name} 
                        className="h-12 w-12 object-cover"
                      />
                    )}
                  </td>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">${product.price}</td>
                  <td className="border p-2">{product.stock_quantity} {product.unit}</td>
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