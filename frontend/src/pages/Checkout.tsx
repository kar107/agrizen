import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.user_id || 0;

  useEffect(() => {
    const storedCart = localStorage.getItem("Cart_data");
    const storedAddresses = localStorage.getItem("addresses");

    if (storedCart) {
      const parsedCartData = JSON.parse(storedCart);
      setCart(Array.isArray(parsedCartData.data) ? parsedCartData.data : []);
    }

    if (storedAddresses) {
      const parsedAddresses = JSON.parse(storedAddresses);
      setAddresses(parsedAddresses);
      if (parsedAddresses.length > 0) {
        setSelectedAddressIndex(0);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.total), 0);
    setTotalAmount(total);
  }, [cart]);

  const saveAddressesToStorage = (updated: any[]) => {
    localStorage.setItem("addresses", JSON.stringify(updated));
    setAddresses(updated);
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street) return;
    const updated = [...addresses, newAddress];
    saveAddressesToStorage(updated);
    setNewAddress({ fullName: "", phone: "", street: "", city: "", state: "", zip: "" });
    if (selectedAddressIndex === -1) {
      setSelectedAddressIndex(0);
    }
  };

  const handleEditAddress = (index: number) => {
    setEditingIndex(index);
    setEditingAddress({ ...addresses[index] });
  };

  const handleUpdateAddress = () => {
    if (editingIndex === null) return;
    const updated = [...addresses];
    updated[editingIndex] = editingAddress;
    saveAddressesToStorage(updated);
    setEditingIndex(null);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (index: number) => {
    const updated = addresses.filter((_, i) => i !== index);
    saveAddressesToStorage(updated);

    if (selectedAddressIndex === index) {
      setSelectedAddressIndex(updated.length > 0 ? 0 : -1);
    } else if (selectedAddressIndex > index) {
      setSelectedAddressIndex(prev => prev - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === -1) {
      alert("Please select a shipping address.");
      return;
    }

    const orderPayload = {
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: addresses[selectedAddressIndex],
      payment_method: "cod",
      cart_items: cart,
    };

    try {
      const res = await fetch("http://localhost/agrizen/backend/adminController/orderController.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("Order placed successfully!");
        localStorage.removeItem("Cart_data");
        navigate("/orders");
      } else {
        alert("Order failed: " + data.message);
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-5 gap-6">
      {/* Address Section */}
      <motion.div className="col-span-3 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <div
              key={index}
              onClick={() => setSelectedAddressIndex(index)}
              className={`cursor-pointer border p-4 mb-3 rounded-md transition-colors duration-200 ${
                selectedAddressIndex === index
                  ? "border-green-600 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }`}
            >
              {editingIndex === index ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" className="border p-2 rounded" value={editingAddress.fullName} onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })} />
                  <input type="text" className="border p-2 rounded" value={editingAddress.phone} onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })} />
                  <input type="text" className="border p-2 rounded" value={editingAddress.street} onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })} />
                  <input type="text" className="border p-2 rounded" value={editingAddress.city} onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })} />
                  <input type="text" className="border p-2 rounded" value={editingAddress.state} onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })} />
                  <input type="text" className="border p-2 rounded" value={editingAddress.zip} onChange={(e) => setEditingAddress({ ...editingAddress, zip: e.target.value })} />
                </div>
              ) : (
                <div>
                  <p className="font-medium">{address.fullName}, {address.phone}</p>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city}, {address.state} - {address.zip}
                  </p>
                </div>
              )}
              <div className="mt-2 flex gap-2 flex-wrap">
                {editingIndex === index ? (
                  <button onClick={handleUpdateAddress} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); handleEditAddress(index); }} className="bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                )}
                <button onClick={(e) => { e.stopPropagation(); handleDeleteAddress(index); }} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses added yet.</p>
        )}

        {/* Add New Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <input type="text" placeholder="Full Name" className="border p-2 rounded" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
          <input type="text" placeholder="Phone" className="border p-2 rounded" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
          <input type="text" placeholder="Street" className="border p-2 rounded" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
          <input type="text" placeholder="City" className="border p-2 rounded" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          <input type="text" placeholder="State" className="border p-2 rounded" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
          <input type="text" placeholder="ZIP" className="border p-2 rounded" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
        </div>
        <button onClick={handleAddAddress} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">Add Address</button>
      </motion.div>

      {/* Cart & Payment Section */}
      <motion.div className="col-span-2 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Items</h2>
        {cart.map((item) => (
          <div key={item.cart_id} className="flex justify-between border-b py-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">{item.quantity} x ${item.price}</p>
            </div>
            <p className="font-semibold">${item.total}</p>
          </div>
        ))}
        <div className="text-right mt-4 text-lg font-bold">Total: ${totalAmount.toFixed(2)}</div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
        <div className="border p-3 rounded-md flex items-center gap-3">
          <input type="radio" name="payment" checked readOnly />
          <label>Cash on Delivery</label>
        </div>

        <button onClick={handlePlaceOrder} className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
          Place Order
        </button>
      </motion.div>
    </div>
  );
};

export default Checkout;
