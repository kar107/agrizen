import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Key, Edit } from "lucide-react";

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <User className="h-5 w-5 mr-2" /> Profile
      </h2>

      {isEditing ? (
        <>
          <input type="text" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} className="border p-2 w-full mt-2" placeholder="Enter Name" />
          <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} className="border p-2 w-full mt-2" placeholder="Enter Email" />
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" onClick={handleProfileUpdate}>Save Changes</button>
        </>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <button className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 inline-block mr-1" /> Edit Profile
          </button>
        </>
      )}

      <h3 className="mt-4 text-lg font-semibold">Change Password</h3>
      {isChangingPassword ? (
        <>
          <input type="password" placeholder="New Password" className="border p-2 w-full mt-2" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
          <input type="password" placeholder="Confirm Password" className="border p-2 w-full mt-2" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={handlePasswordChange}>Save Password</button>
        </>
      ) : (
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={() => setIsChangingPassword(true)}>
          <Key className="h-4 w-4 inline-block mr-1" /> Change Password
        </button>
      )}
      
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </motion.div>
  );
};

export default Profile;
