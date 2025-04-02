import React from 'react';
import { motion } from 'framer-motion';
import { Plane as Plant, BarChart3, Cloud, Truck, Database, Shield, MessageSquare, Settings } from 'lucide-react';

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://agrierp.com/blog/wp-content/uploads/2023/06/5-Ways-Farmers-Financial-Solutions-Can-Help-You-Grow-Your-Farm-copy-scaled.jpg"
            alt="Modern farming"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl max-w-2xl"
            >
              Comprehensive solutions for modern agriculture management
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              icon={<Plant />}
              title="Crop Management"
              description="Advanced monitoring and optimization tools for crop growth, disease detection, and yield prediction."
              features={[
                "Real-time monitoring",
                "Disease detection",
                "Yield prediction",
                "Growth tracking"
              ]}
            />
            <ServiceCard
              icon={<BarChart3 />}
              title="Market Analytics"
              description="Data-driven insights for market trends, pricing strategies, and demand forecasting."
              features={[
                "Price analysis",
                "Market trends",
                "Demand forecasting",
                "Competition tracking"
              ]}
            />
            <ServiceCard
              icon={<Cloud />}
              title="Weather Insights"
              description="Accurate weather forecasting and alerts to help plan farming activities effectively."
              features={[
                "Weather forecasting",
                "Alert system",
                "Historical data",
                "Climate analysis"
              ]}
            />
            <ServiceCard
              icon={<Truck />}
              title="Supply Chain Management"
              description="End-to-end supply chain solutions for efficient distribution and logistics."
              features={[
                "Logistics tracking",
                "Inventory management",
                "Distribution optimization",
                "Quality control"
              ]}
            />
            <ServiceCard
              icon={<Database />}
              title="Data Management"
              description="Secure and efficient management of farm data for better decision-making."
              features={[
                "Data storage",
                "Analytics",
                "Reporting",
                "Integration"
              ]}
            />
            <ServiceCard
              icon={<Shield />}
              title="Risk Management"
              description="Comprehensive risk assessment and management solutions for your farm."
              features={[
                "Risk assessment",
                "Insurance solutions",
                "Compliance tracking",
                "Safety protocols"
              ]}
            />
            <ServiceCard
              icon={<MessageSquare />}
              title="Advisory Services"
              description="Expert consultation and support for optimal farming practices."
              features={[
                "Expert consultation",
                "Best practices",
                "Training programs",
                "Support services"
              ]}
            />
            <ServiceCard
              icon={<Settings />}
              title="Farm Automation"
              description="Smart automation solutions to increase efficiency and productivity."
              features={[
                "Process automation",
                "Smart irrigation",
                "Equipment monitoring",
                "Energy management"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl mb-8">Get started with our smart farming solutions today</p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description, features }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="text-green-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default Services;