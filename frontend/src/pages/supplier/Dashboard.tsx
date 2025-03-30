import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Bell,
  MessageSquare,
  Settings,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import DashboardSidebar from '../../components/DashboardSidebar';

const SupplierDashboard = () => {
  const stats = [
    { title: 'Total Products', value: '45', icon: Package, change: '+5%' },
    { title: 'Active Orders', value: '12', icon: ShoppingCart, change: '+10%' },
    { title: 'Monthly Revenue', value: '$8,245', icon: DollarSign, change: '+15%' },
    { title: 'Pending Queries', value: '3', icon: MessageSquare, change: '-2%' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar type="supplier" />
      <div className="flex-1 ml-[280px] p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Supplier Dashboard</h1>
            <p className="text-gray-600">Welcome back, Supplier ABC</p>
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
                  <span className={`text-sm font-semibold ${stat.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
            <div className="space-y-4">
              <OrderItem
                orderId="#12345"
                product="Organic Fertilizer"
                customer="John Doe"
                status="Processing"
                amount="$249.99"
              />
              <OrderItem
                orderId="#12344"
                product="Smart Irrigation System"
                customer="Jane Smith"
                status="Shipped"
                amount="$599.99"
              />
              <OrderItem
                orderId="#12343"
                product="Premium Seeds Pack"
                customer="Mike Johnson"
                status="Delivered"
                amount="$149.99"
              />
              <OrderItem
                orderId="#12342"
                product="Pest Control Kit"
                customer="Sarah Williams"
                status="Processing"
                amount="$89.99"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderItem = ({ orderId, product, customer, status, amount }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-gray-900">{orderId}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{product}</p>
        <p className="text-sm text-gray-500">{customer}</p>
      </div>
      <span className="font-semibold text-gray-900">{amount}</span>
    </div>
  );
};

export default SupplierDashboard;