import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Add import for Link
import {
  ArrowRight,
  BarChart3,
  Cloud,
  Plane as Plant,
  Users,
} from "lucide-react";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80"
            alt="Farm field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold mb-6"
            >
              Smart Farming for a <br />
              Better Tomorrow
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 max-w-2xl"
            >
              Transform your agricultural practices with our comprehensive
              management system. Connect with suppliers, track your crops, and
              grow your business.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-x-4"
            >
              <Link to="/register"> {/* Wrap the button in a Link */}
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                  Get Started
                </button>
              </Link>
              <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AgroSmart?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides comprehensive solutions for modern farming
              needs, helping you maximize efficiency and productivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Plant className="h-8 w-8" />}
              title="Crop Management"
              description="Track and optimize your crop growth with advanced monitoring tools"
            />
            <FeatureCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Market Analytics"
              description="Make informed decisions with real-time market data and trends"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Supply Chain"
              description="Connect directly with suppliers and buyers in our marketplace"
            />
            <FeatureCard
              icon={<Cloud className="h-8 w-8" />}
              title="Weather Insights"
              description="Stay ahead with accurate weather forecasts and alerts"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of farmers who are already growing with AgroSmart
          </p>
          <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition inline-flex items-center">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="text-green-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default Home;