import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductSingle = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

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
  }, [id]);

  if (!product) return <div className="text-center text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={`http://localhost/agrizen/backend/uploads/products/${product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="mt-4">
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
          </div>
          <div className="mt-4">
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700">
              <ShoppingCart className="h-5 w-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSingle;
