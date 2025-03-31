import axios from "axios";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import Swal from "sweetalert2";

interface Category {
  id: number;
  name: string;
  description: string;
  user_id: number | null;
  status: string;
  created_at: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    user_id: null,
    status: "active",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost/agrizen/backend/adminController/categoryController.php";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch categories. Please check API connection.',
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData?.userid || null;

    try {
      const dataToSubmit = { ...formData, user_id: userId };
      
      let response;
      if (editing) {
        response = await axios.put(API_URL, JSON.stringify(dataToSubmit), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(API_URL, JSON.stringify(dataToSubmit), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: editing ? 'Category updated successfully!' : 'Category added successfully!',
        });
        fetchCategories();
        setEditing(false);
        setFormData({
          id: null,
          name: "",
          description: "",
          user_id: userId,
          status: "active",
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

  const handleEdit = (category) => {
    setFormData({ ...category });
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
          'Your category has been deleted.',
          'success'
        );
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete category',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="admin" />
      <div className="flex-1 ml-[280px] p-6">
        <h1 className="text-3xl font-bold mb-4">Category Management</h1>

        {/* Form */}
        <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
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
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border p-2 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
          >
            {editing ? "Update" : "Add"} Category
          </button>
        </form>

        {/* Category List */}
        <div className="mt-6 bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold mb-2">Categories</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border">
                  <td className="border p-2">{category.id}</td>
                  <td className="border p-2">{category.name}</td>
                  <td className="border p-2">{category.description}</td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
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

export default CategoryManagement;