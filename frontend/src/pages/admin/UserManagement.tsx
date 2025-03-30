import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DashboardSidebar from "../../components/DashboardSidebar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: "",
    email: "",
    password: "",
    role: "farmer",
  });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "http://localhost/agrizen/backend/adminController/usermanageController.php";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to fetch users. Please check API connection.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editing) {
        await axios.put(API_URL, JSON.stringify(formData), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        Swal.fire("Updated!", "User updated successfully.", "success");
      } else {
        await axios.post(API_URL, JSON.stringify(formData), {
          headers: {
            "Content-Type": "application/json",
          },
        });
        Swal.fire("Added!", "User added successfully.", "success");
      }

      fetchUsers();
      setEditing(false);
      setFormData({ id: null, name: "", email: "", password: "", role: "farmer" });
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
      setError("Error processing request");
    }
  };

  const handleEdit = (user: User) => {
    setFormData({ ...user, password: "" });
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
          fetchUsers();
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete user.", "error");
        }
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="admin" />
      <div className="flex-1 ml-[280px] p-6">
        <h1 className="text-3xl font-bold mb-4">User Management</h1>

        {/* Form */}
        <form className="bg-white p-4 shadow rounded" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border p-2 rounded"
              required
            />
            {!editing && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            )}
            <select name="role" value={formData.role} onChange={handleInputChange} className="border p-2 rounded">
              <option value="farmer">Farmer</option>
              <option value="supplier">Supplier</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-3">
            {editing ? "Update" : "Add"} User
          </button>
        </form>

        {/* User List */}
        <div className="mt-6 bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

export default UserManagement;
