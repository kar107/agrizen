import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCart = localStorage.getItem("Cart_data");

    if (!storedUser || !storedCart) return;

    const parsedCartData = JSON.parse(storedCart);
    const cartItems = Array.isArray(parsedCartData.data)
      ? parsedCartData.data
      : [];

    setCart(cartItems);

    const total = cartItems.reduce(
      (acc: number, item: any) => acc + parseFloat(item.total),
      0
    );
    setTotalAmount(total);
    setLoading(false);
  }, []);

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || !user.user_id) {
      alert("User not found. Please login again.");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Please enter a shipping address.");
      return;
    }

    const orderPayload = {
      user_id: user.user_id,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      cart_items: cart,
    };

    const res = await fetch(
      "http://localhost/agrizen/backend/adminController/orderController.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const data = await res.json();

    if (data.status === 200) {
      alert("Order placed successfully!");
      localStorage.removeItem("Cart_data");
      localStorage.removeItem("Cart_count");
      navigate("/orders");
    } else {
      alert("Order failed: " + data.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-600 text-lg">
        Loading checkout...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Checkout</h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.cart_id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x ${item.price}
                  </p>
                </div>
                <p className="font-semibold">${item.total}</p>
              </div>
            ))
          )}
          <div className="text-right mt-4 text-lg font-bold">
            Total: ${totalAmount.toFixed(2)}
          </div>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <textarea
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-green-400"
            rows={4}
            placeholder="Enter full shipping address..."
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
          />
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
              />
              <span>Stripe</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
