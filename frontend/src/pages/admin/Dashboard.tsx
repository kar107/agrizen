import { motion } from "framer-motion";
import {
  AlertTriangle,
  MessageSquare,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "2,345", icon: Users, change: "+12%" },
    { title: "Products Listed", value: "1,456", icon: Package, change: "+8%" },
    { title: "Total Orders", value: "892", icon: ShoppingCart, change: "+15%" },
    { title: "Active Alerts", value: "24", icon: AlertTriangle, change: "+3%" },
  ];
  const userData = localStorage.getItem("user");

  let userName = ""; // Get the name property
  if (userData) {
    try {
      const user = JSON.parse(userData); // Parse JSON string to object
      userName = user.name;
      console.log("User name:", userName);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  } else {
    console.log("No user data found in localStorage");
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar type="admin" />
      <div className="flex-1 ml-[280px] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {userName}</p>
          </div>

          {/* Stats Grid */}
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
                  <span
                    className={`text-sm font-semibold ${
                      stat.change.includes("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
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
