import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    const userId = user.userid || user.user_id;

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    fetch(`http://localhost/agrizen/backend/adminController/cartController.php?user_id=${userId}`)
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) throw new Error(`Server Error: ${res.status} - ${text}`);
        return JSON.parse(text);
      })
      .then((data) => {
        localStorage.setItem("Cart_data",JSON.stringify(data));
        localStorage.setItem("Cart_count",data.data.length);
        if (data.status === 200 && data.data) {
          setCart(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching cart:", err.message);
        setLoading(false);
      });
  }, []);

  const removeFromCart = (cartId: number) => {
    fetch(`http://localhost/agrizen/backend/adminController/cartController.php?cart_id=${cartId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Delete response:", data);
        if (data.status === 200) {
          setCart(cart.filter((item: any) => item.cart_id !== cartId));
        } else {
          alert("Failed to remove item from cart: " + data.message);
        }
      })
      .catch((err) => console.error("Error deleting cart item:", err));
  };

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-600 text-lg">Loading your cart...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center text-lg text-gray-600">Your cart is empty.</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6"
        >
          {cart.map((item: any) => (
            <div
              key={item.cart_id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost/agrizen/backend/uploads/products/${item.image}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">${item.price} x {item.quantity}</p>
                  <p className="text-gray-700 font-semibold">Total: ${item.total}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.cart_id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {cart.length > 0 && (
        <div className="mt-6 text-right">
          <Link
            to="/checkout"
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
