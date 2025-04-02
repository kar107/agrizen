import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Sprout } from "lucide-react";
import React, { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("farmer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      const user = JSON.parse(userData);
      console.log("User detected in localStorage:", user); // Debugging line

      if (user.role === "Farmer") {
        navigate("/");
      } else if (user.role === "Admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "Supplier") {
        navigate("/supplier/dashboard");
      }
    }
  }, [navigate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("tag", "register");
    payload.append("name", `${formData.firstName} ${formData.lastName}`);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    payload.append("role", userType);

    try {
      const response = await fetch(
        "http://localhost/agrizen/backend/adminController/registerController.php",
        {
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();

      if (data.status === "200") {
        alert("Registration successful!");
        navigate("/login"); 
      } else {
        alert(data.message);
      } 
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-center"
        >
          <Sprout className="h-12 w-12 text-green-600" />
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                I am a
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {["farmer", "supplier"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`${
                      userType === type
                        ? "bg-green-50 border-green-600 text-green-600"
                        : "bg-white border-gray-300 text-gray-700"
                    } border rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium uppercase hover:bg-green-50 transition-colors`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
