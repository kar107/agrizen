import { Menu, Sprout, X, User, LogOut, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ flag, setflag, cart_count }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [flag, cart_count]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setflag(!flag);
  };

  return (
    <nav className="bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8" />
              <span className="font-bold text-xl">AgroSmart</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="hover:bg-green-600 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/about" className="hover:bg-green-600 px-3 py-2 rounded-md">
                About
              </Link>
              <Link to="/services" className="hover:bg-green-600 px-3 py-2 rounded-md">
                Services
              </Link>
              <Link to="/marketplace" className="hover:bg-green-600 px-3 py-2 rounded-md">
                Marketplace
              </Link>
              <Link to="/cart" className="hover:bg-green-600 px-3 py-2 rounded-md flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Link>
              <Link to="/contact" className="hover:bg-green-600 px-3 py-2 rounded-md">
                Contact
              </Link>

              {/* If user is logged in, show dropdown menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-4 py-2 rounded-md font-medium hover:bg-green-600 flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span>{user.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white text-green-700 rounded-md shadow-lg z-50">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-green-100">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 hover:bg-green-100">
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-green-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/register" className="bg-white text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-100">
                  Sign Up
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block hover:bg-green-600 px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/about" className="block hover:bg-green-600 px-3 py-2 rounded-md">
              About
            </Link>
            <Link to="/services" className="block hover:bg-green-600 px-3 py-2 rounded-md">
              Services
            </Link>
            <Link to="/marketplace" className="block hover:bg-green-600 px-3 py-2 rounded-md">
              Marketplace
            </Link>
            <Link to="/cart" className="block hover:bg-green-600 px-3 py-2 rounded-md flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
            </Link>
            <Link to="/contact" className="block hover:bg-green-600 px-3 py-2 rounded-md">
              Contact
            </Link>

            {/* Mobile - If user is logged in, show dropdown menu */}
            {user ? (
              <>
                <Link to="/profile" className="block hover:bg-green-600 px-3 py-2 rounded-md">
                  Profile
                </Link>
                <Link to="/orders" className="block hover:bg-green-600 px-3 py-2 rounded-md">
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-green-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/register" className="block bg-white text-green-700 px-4 py-2 rounded-md font-medium hover:bg-green-100">
                Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
