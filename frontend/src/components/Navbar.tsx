import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sprout } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8" />
              <span className="font-bold text-xl">AgroSmart</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-green-600 px-3 py-2 rounded-md">Home</Link>
              <Link to="/about" className="hover:bg-green-600 px-3 py-2 rounded-md">About</Link>
              <Link to="/services" className="hover:bg-green-600 px-3 py-2 rounded-md">Services</Link>
              <Link to="/marketplace" className="hover:bg-green-600 px-3 py-2 rounded-md">Marketplace</Link>
              <Link to="/contact" className="hover:bg-green-600 px-3 py-2 rounded-md">Contact</Link>
              <Link to="/register" className="bg-white text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-100">
                Sign Up
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block hover:bg-green-600 px-3 py-2 rounded-md">Home</Link>
            <Link to="/about" className="block hover:bg-green-600 px-3 py-2 rounded-md">About</Link>
            <Link to="/services" className="block hover:bg-green-600 px-3 py-2 rounded-md">Services</Link>
            <Link to="/marketplace" className="block hover:bg-green-600 px-3 py-2 rounded-md">Marketplace</Link>
            <Link to="/contact" className="block hover:bg-green-600 px-3 py-2 rounded-md">Contact</Link>
            <Link to="/register" className="block text-center bg-white text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-100">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;