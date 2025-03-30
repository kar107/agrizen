import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2">
              <Sprout className="h-8 w-8" />
              <span className="font-bold text-xl">AgroSmart</span>
            </div>
            <p className="mt-4 text-gray-300">
              Empowering farmers with smart agriculture solutions for a sustainable future.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-green-400"><Facebook className="h-6 w-6" /></a>
              <a href="#" className="hover:text-green-400"><Twitter className="h-6 w-6" /></a>
              <a href="#" className="hover:text-green-400"><Instagram className="h-6 w-6" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-green-400">Home</Link></li>
              <li><Link to="/about" className="hover:text-green-400">About Us</Link></li>
              <li><Link to="/services" className="hover:text-green-400">Services</Link></li>
              <li><Link to="/marketplace" className="hover:text-green-400">Marketplace</Link></li>
              <li><Link to="/contact" className="hover:text-green-400">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400">Farm Management</a></li>
              <li><a href="#" className="hover:text-green-400">Crop Monitoring</a></li>
              <li><a href="#" className="hover:text-green-400">Market Analysis</a></li>
              <li><a href="#" className="hover:text-green-400">Weather Forecasting</a></li>
              <li><a href="#" className="hover:text-green-400">Supply Chain</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>123 Farm Street, Agro City</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>contact@agrosmart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} AgroSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;