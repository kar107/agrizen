import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PackageCheck, Truck, CreditCard } from "lucide-react";

interface ShippingAddress {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface Order {
  order_id: number;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  shipping_address: string; // this will be JSON string
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const uid = parsedUser.userid || parsedUser.user_id;

      fetch(`http://localhost/agrizen/backend/adminController/orderController.php?user_id=${uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setOrders(data.data);
          } else {
            console.error("Failed to fetch orders:", data.message);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ opacity: [0, 1], y: [10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-center text-lg text-gray-700"
        >
          Loading Orders...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold text-green-700 mb-10">🧾 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {orders.map((order) => {
            let parsed: ShippingAddress = {};
            try {
              parsed = JSON.parse(order.shipping_address || '{}');
            } catch {
              parsed = {};
            }

            const statusColor =
              order.status === "Completed" ? "bg-green-100 text-green-700" :
              order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-700";

            return (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <PackageCheck className="text-green-600" size={24} />
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order #{order.order_id}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p>
                      <strong>Total:</strong> $
                      {typeof order.total_amount === 'number'
                        ? order.total_amount.toFixed(2)
                        : parseFloat(order.total_amount as any).toFixed(2)}
                    </p>
                    <p className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-500" /> {order.payment_method}
                    </p>
                    <p className="flex items-center gap-2">
                      <Truck size={16} className="text-gray-500" /> Placed on:{" "}
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="overflow-x-auto break-words">
                    <p className="font-medium mb-1">Shipping Address:</p>
                    <p className="whitespace-pre-line text-sm text-gray-600 leading-relaxed">
                      {parsed.fullName && <>{parsed.fullName}<br /></>}
                      {parsed.phone && <>{parsed.phone}<br /></>}
                      {parsed.street && <>{parsed.street}<br /></>}
                      {parsed.city && parsed.state && parsed.zip && (
                        <>{parsed.city}, {parsed.state} - {parsed.zip}<br /></>
                      )}
                      {parsed.country && <>{parsed.country}</>}
                      {!parsed.fullName && !parsed.street && !parsed.city && (
                        <span className="text-gray-500 italic">Address not available</span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
