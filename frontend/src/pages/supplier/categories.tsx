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
  const API_URL = "http://localhost/agrizen/backend/adminController/categoryController.php";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    let userId = userData?.userid || null;
    setFormData((prev) => ({ ...prev, user_id: userId }));
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data.data || []);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch categories. Please check API connection.", "error");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (editing) {
        response = await axios.put(API_URL, JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        response = await axios.post(API_URL, JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (response.data.status === 200) {
        fetchCategories();
        setEditing(false);
        setFormData({
          id: null,
          name: "",
          description: "",
          user_id: JSON.parse(localStorage.getItem("user") || "{}")?.userid || null,
          status: "active",
        });
        Swal.fire("Success", `Category ${editing ? "updated" : "added"} successfully!`, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error processing request. Please try again.", "error");
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({ ...category });
    setEditing(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}?id=${id}`);
          fetchCategories();
          Swal.fire("Deleted!", "Category has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Error deleting category.", "error");
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="supplier" />
      <div className="flex-1 ml-[280px] p-6">
        <h1 className="text-3xl font-bold mb-4">Category Management</h1>

        <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
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
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
            {editing ? "Update" : "Add"} Category
          </button>
        </form>

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
                  <td className="border p-2">{category.status}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
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