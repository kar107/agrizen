import axios from "axios";
import React, { useEffect, useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import Swal from "sweetalert2";

interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  created_at: string;
}

const SupplierOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Get user_id from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.user_id;

  const API_URL =
    "http://localhost/agrizen/backend/adminController/adminordersController.php";

  useEffect(() => {
    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}?user_id=${userId}`);
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch orders. Please check API connection.",
      });
    }
  };

  const updateStatus = async (
    orderId: number,
    field: "order_status" | "payment_status",
    value: string
  ) => {
    try {
      const response = await axios.put(API_URL, {
        order_id: orderId,
        [field]: value,
      });

      if (response.data.status === 200) {
        Swal.fire("Updated!", `${field.replace("_", " ")} updated successfully.`, "success");
        fetchOrders();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating status", error);
      Swal.fire("Error", "Failed to update status.", "error");
    }
  };

  const deleteOrder = async (orderId: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${API_URL}?order_id=${orderId}`);
        if (response.data.status === 200) {
          Swal.fire("Deleted!", "Order has been deleted.", "success");
          fetchOrders();
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting order", error);
        Swal.fire("Error", "Failed to delete order.", "error");
      }
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="supplier" />
      <div className="flex-1 ml-[280px] p-4 sm:p-6 overflow-x-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">My Orders</h1>

        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Orders</h2>

          <div className="w-full overflow-x-auto">
            <table className="min-w-[800px] w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-2">Order ID</th>
                  <th className="border p-2">User ID</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Order Status</th>
                  <th className="border p-2">Payment Status</th>
                  <th className="border p-2">Payment Method</th>
                  <th className="border p-2">Shipping Address</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.order_id} className="border">
                    <td className="border p-2">{order.order_id}</td>
                    <td className="border p-2">{order.user_id}</td>
                    <td className="border p-2">${order.total_amount}</td>

                    <td className="border p-2">
                      <select
                        value={order.order_status}
                        onChange={(e) =>
                          updateStatus(order.order_id, "order_status", e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="border p-2">
                      <select
                        value={order.payment_status}
                        onChange={(e) =>
                          updateStatus(order.order_id, "payment_status", e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>

                    <td className="border p-2">{order.payment_method}</td>
                    <td className="border p-2 whitespace-pre-wrap">
                      {order.shipping_address}
                    </td>
                    <td className="border p-2">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => deleteOrder(order.order_id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 flex-wrap gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierOrders;
