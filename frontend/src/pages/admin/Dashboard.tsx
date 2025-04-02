import { motion } from "framer-motion";
import {
  AlertTriangle,
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/DashboardSidebar";

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: "0", icon: Users, change: "+0%" },
    { title: "Products Listed", value: "0", icon: Package, change: "+0%" },
    { title: "Total Orders", value: "0", icon: ShoppingCart, change: "+0%" },
    { title: "Active Alerts", value: "0", icon: AlertTriangle, change: "+0%" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      console.log("No user found, redirecting to login");
      navigate("/login");
    } else {
      const user = JSON.parse(userData);
      console.log("Admin check:", user);

      if (user.role !== "Admin") {
        console.log("Unauthorized user, redirecting");
        navigate("/");
      }
    }
  }, [navigate]);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fetch Dashboard Stats
    fetch(
      "http://localhost/agrizen/backend/adminController/adminController.php"
    ) // Replace with your actual API endpoint
      .then(async (res) => {
        const text = await res.text();
        console.log("Raw response:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.status === 200) {
          setStats([
            {
              title: "Total Users",
              value: data.data.totalUsers,
              icon: Users,
              change: "+12%",
            },
            {
              title: "Products Listed",
              value: data.data.totalProducts,
              icon: Package,
              change: "+8%",
            },
            {
              title: "Total Orders",
              value: data.data.totalOrders,
              icon: ShoppingCart,
              change: "+15%",
            },
            {
              title: "Active Alerts",
              value: data.data.activeAlerts,
              icon: AlertTriangle,
              change: "+3%",
            },
          ]);
        } else {
          console.error("Error fetching stats:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching stats:", error));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar type="admin" />
      <div className="flex-1 ml-[280px] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <stat.icon className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <ActivityItem
                  title="New User Registration"
                  description="John Doe registered as a farmer"
                  time="2 minutes ago"
                  icon={Users}
                />
                <ActivityItem
                  title="Product Listed"
                  description="New organic fertilizer listed by Supplier ABC"
                  time="15 minutes ago"
                  icon={Package}
                />
                <ActivityItem
                  title="Order Completed"
                  description="Order #12345 was successfully delivered"
                  time="1 hour ago"
                  icon={ShoppingCart}
                />
                <ActivityItem
                  title="Support Ticket"
                  description="New support ticket from user regarding payment"
                  time="2 hours ago"
                  icon={MessageSquare}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon: Icon, title, description, time }) => (
  <div className="flex items-start space-x-4">
    <div className="p-2 bg-green-100 rounded-lg">
      <Icon className="h-5 w-5 text-green-600" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  </div>
);

export default AdminDashboard;
