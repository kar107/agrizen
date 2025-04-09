import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadStripe
} from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RBvTeECSsdmHHbj0L5fJ4YrWB5kSZ89DJt4shxeDpSp1jsPk0wNqHGzPdLlbErAVIM4ofjhKjx2vNeOmC2IVZrQ00EDfpIWqS"); // Replace with your Stripe public key

const CheckoutForm = ({
  totalAmount,
  userId,
  addresses,
  selectedAddressIndex,
  cart,
  onSuccess
}: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleStripePayment = async () => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement!);
    if (error) {
      alert(error.message);
      return;
    }

    const orderPayload = {
      user_id: userId,
      total_amount: totalAmount,
      shipping_address: addresses[selectedAddressIndex],
      payment_method: "stripe",
      stripe_token: token?.id,
      cart_items: cart,
    };

    try {
      const res = await fetch(
        "http://localhost/agrizen/backend/adminController/orderController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );

      const data = await res.json();

      if (data.status === 200) {
        alert("Order placed successfully!");
        localStorage.removeItem("Cart_data");
        onSuccess();
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
    <div className="mt-4">
      <CardElement className="p-3 border rounded" />
      <button
        onClick={handleStripePayment}
        className="mt-4 w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        Pay with Stripe
      </button>
    </div>
  );
};

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
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData?.userid || null;

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
    setNewAddress({
      fullName: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    });
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
      setSelectedAddressIndex((prev) => prev - 1);
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
      const res = await fetch(
        "http://localhost/agrizen/backend/adminController/orderController.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );

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
                  {["fullName", "phone", "street", "city", "state", "zip"].map(
                    (field) => (
                      <input
                        key={field}
                        type="text"
                        className="border p-2 rounded"
                        value={editingAddress[field]}
                        onChange={(e) =>
                          setEditingAddress({
                            ...editingAddress,
                            [field]: e.target.value,
                          })
                        }
                      />
                    )
                  )}
                </div>
              ) : (
                <div>
                  <p className="font-medium">
                    {address.fullName}, {address.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city}, {address.state} -{" "}
                    {address.zip}
                  </p>
                </div>
              )}
              <div className="mt-2 flex gap-2 flex-wrap">
                {editingIndex === index ? (
                  <button
                    onClick={handleUpdateAddress}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(index);
                    }}
                    className="bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(index);
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No addresses added yet.</p>
        )}

        {/* Add New Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {["fullName", "phone", "street", "city", "state", "zip"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              className="border p-2 rounded"
              value={newAddress[field as keyof typeof newAddress]}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  [field]: e.target.value,
                })
              }
            />
          ))}
        </div>
        <button
          onClick={handleAddAddress}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Add Address
        </button>
      </motion.div>

      {/* Cart & Payment Section */}
      <motion.div className="col-span-2 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Items</h2>
        {cart.map((item) => (
          <div
            key={item.cart_id}
            className="flex justify-between border-b py-2"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                {item.quantity} x ${item.price}
              </p>
            </div>
            <p className="font-semibold">${item.total}</p>
          </div>
        ))}
        <div className="text-right mt-4 text-lg font-bold">
          Total: ${totalAmount.toFixed(2)}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Payment Method</h2>
        <div className="flex flex-col gap-3">
          <label className="flex gap-3 items-center border p-3 rounded-md">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={() => setSelectedPayment("cod")}
            />
            Cash on Delivery
          </label>

          <label className="flex gap-3 items-center border p-3 rounded-md">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={selectedPayment === "stripe"}
              onChange={() => setSelectedPayment("stripe")}
            />
            Stripe
          </label>
        </div>

        {selectedPayment === "cod" ? (
          <button
            onClick={handlePlaceOrder}
            className="mt-6 w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Place Order (COD)
          </button>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              totalAmount={totalAmount}
              userId={userId}
              addresses={addresses}
              selectedAddressIndex={selectedAddressIndex}
              cart={cart}
              onSuccess={() => {}}
            />
          </Elements>
        )}
      </motion.div>
    </div>
  );
};

export default Checkout;
