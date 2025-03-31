import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Edit } from "lucide-react";
import DashboardSidebar from "../../components/DashboardSidebar";

const Profile = () => {
  const [user, setUser] = useState({ userid: "", name: "", email: "", role: "" });
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch("http://localhost/agrizen/backend/adminController/profileController.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: user.userid, name: user.name, email: user.email }),
      });
      
      const data = await response.json();
      setMessage(data.message);
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      setMessage("Error updating profile");
      console.error("Error:", error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost/agrizen/backend/adminController/profileController.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: user.userid, password: passwordData.newPassword }),
      });
      
      const data = await response.json();
      setMessage(data.message);
      setIsChangingPassword(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage("Error updating password");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardSidebar type="supplier" />
      <div className="flex-1 ml-[280px] p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto mt-10 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-700">
          <User className="h-6 w-6 mr-2 text-blue-500" /> Profile
        </h2>

        {isEditing ? (
          <>
            <input type="text" value={user.name} 
              onChange={(e) => setUser({ ...user, name: e.target.value })} 
              className="border border-gray-300 rounded-lg p-3 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Enter Name" />
            <input type="email" value={user.email} 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
              className="border border-gray-300 rounded-lg p-3 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-blue-400" 
              placeholder="Enter Email" />
            <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full transition-all" onClick={handleProfileUpdate}>Save Changes</button>
          </>
        ) : (
          <>
            <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-700"><strong>Role:</strong> {user.role}</p>
            <button className="mt-5 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg w-full transition-all" onClick={() => setIsEditing(true)}>
              <Edit className="h-5 w-5 inline-block mr-1" /> Edit Profile
            </button>
          </>
        )}

        <h3 className="mt-6 text-xl font-semibold text-gray-700">Change Password</h3>
        {isChangingPassword ? (
          <>
            <input type="password" placeholder="New Password" 
              className="border border-gray-300 rounded-lg p-3 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-green-400" 
              value={passwordData.newPassword} 
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            <input type="password" placeholder="Confirm Password" 
              className="border border-gray-300 rounded-lg p-3 w-full mt-3 focus:outline-none focus:ring-2 focus:ring-green-400" 
              value={passwordData.confirmPassword} 
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
            <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg w-full transition-all" onClick={handlePasswordChange}>Save Password</button>
          </>
        ) : (
          <button className="mt-5 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg w-full transition-all" onClick={() => setIsChangingPassword(true)}>
            <Key className="h-5 w-5 inline-block mr-1" /> Change Password
          </button>
        )}
        
        {message && <p className="mt-3 text-red-500 font-medium text-center">{message}</p>}
      </motion.div>
      </div>
    </div>
  );
};

export default Profile;
