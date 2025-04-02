import { motion } from "framer-motion";
import { Filter, Search, ShoppingCart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    fetch("http://localhost/agrizen/backend/adminController/categoryController.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCategories(["All", ...data.data.map((category) => category.name)]);
        } else {
          console.error("Failed to fetch categories:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost/agrizen/backend/adminController/marketplaceController.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <section className="relative h-[300px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?auto=format&fit=crop&q=80"
            alt="Marketplace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-4">
              Agricultural Marketplace
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl">
              Find everything you need for your farm
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-gray-700 text-lg">Categories</div>
              <Filter className="text-gray-600" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link to={`/productsingle/${product.id}`}>
      <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="h-48 relative">
          <img src={`http://localhost/agrizen/backend/uploads/products/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{product.category}</span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition">
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default Marketplace;
