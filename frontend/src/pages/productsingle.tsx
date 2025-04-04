import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductSingle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [quantity, setQuantity] = useState<number>(1); // 👈 Quantity state

  useEffect(() => {
    fetch(`http://localhost/agrizen/backend/adminController/productdetailsController.php?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProduct(data.data);
        } else {
          console.error("Failed to fetch product:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching product:", error));

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const uid = parsedUser.userid || parsedUser.user_id;
        if (uid) {
          setUserId(uid);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, [id]);

  const addToCart = () => {
    const storedUser = localStorage.getItem("user");
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const uid = userData?.userid || userData?.user_id;

    if (!uid) {
      alert("Please log in to add items to your cart.");
      return;
    }
    if (!product) {
      alert("Product data is missing!");
      return;
    }

    const cartItem = {
      user_id: uid,
      product_id: product.id,
      quantity: quantity,
      price: product.price,
    };

    fetch("http://localhost/agrizen/backend/adminController/cartController.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cartItem),
    })
      .then((response) => response.text())
      .then((text) => {
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.status === 200) {
          alert("Product added to cart successfully");
        } else {
          alert("Failed to add product to cart: " + data.message);
        }
      })
      .catch((error) => console.error("Error adding to cart:", error));
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) =>
      type === "inc" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ opacity: [0, 1], y: [10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-center text-lg text-gray-700"
        >
          Loading...
        </motion.div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-lg shadow-lg"
      >
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={`http://localhost/agrizen/backend/uploads/products/${product.image}`}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-md"
          />
        </motion.div>

        {/* Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center">
            <span className="text-3xl font-bold text-green-600">${product.price}</span>
          </div>

          {/* Quantity Selector */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={() => handleQuantityChange("dec")}
              className="w-8 h-8 text-xl font-bold rounded-full bg-gray-200 hover:bg-gray-300"
            >
              -
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="w-12 text-center border rounded-md py-1"
            />
            <button
              onClick={() => handleQuantityChange("inc")}
              className="w-8 h-8 text-xl font-bold rounded-full bg-gray-200 hover:bg-gray-300"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={addToCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProductSingle;
