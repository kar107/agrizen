import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Package, Bell, ShoppingCart, Settings, BarChart2,
  MessageSquare, ChevronLeft, ChevronRight, Home, LogOut, Sprout, Folder, User as UserIcon
} from 'lucide-react';

interface SidebarProps {
  type: 'admin' | 'supplier';
  onUserManagementClick?: () => void;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  onClick?: () => void;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ type, onUserManagementClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems: MenuItem[] = useMemo(() => {
    if (type === 'admin') {
      return [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: UserIcon, label: 'Profile', path: '/admin/profile' }, 
        { icon: Users, label: 'User Management', path: '/admin/UserManagement', onClick: onUserManagementClick },
        { icon: Folder, label: 'Categories', path: '/admin/categories', onClick: onUserManagementClick },
        { icon: Package, label: 'Products', path: '/admin/products' },
        { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
        { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
        { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
        { icon: MessageSquare, label: 'Support', path: '/admin/support' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
      ];
    }
    return [
      { icon: Home, label: 'Dashboard', path: '/supplier/dashboard' },
      { icon: UserIcon, label: 'Profile', path: '/supplier/profile' }, 
      { icon: Folder, label: 'Categories', path: '/supplier/categories' },
      { icon: Package, label: 'My Products', path: '/supplier/products' },
      { icon: ShoppingCart, label: 'Orders', path: '/supplier/orders' },
      { icon: BarChart2, label: 'Analytics', path: '/supplier/analytics' },
      { icon: MessageSquare, label: 'Messages', path: '/supplier/messages' },
      { icon: Settings, label: 'Settings', path: '/supplier/settings' },
    ];
  }, [type, onUserManagementClick]);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="h-screen fixed left-0 top-0 bg-white border-r border-gray-200 z-50 shadow-lg"
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
          <Sprout className="h-8 w-8 text-green-600" />
          {!isCollapsed && <span className="font-bold text-xl">AgroSmart</span>}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map(({ icon: Icon, label, path, onClick }) => (
            <Link
              key={path}
              to={path}
              onClick={onClick}
              className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                location.pathname === path ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer - Toggle Sidebar & Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 text-gray-500"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
          <Link
            to="/"
            className="flex items-center space-x-3 p-3 rounded-lg mt-2 hover:bg-gray-50 text-gray-700"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardSidebar;
