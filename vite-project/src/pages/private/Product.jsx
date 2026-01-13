import { useEffect, useState } from "react";


const seedProducts = [
  { _id: "1", name: "Nike Shoes", price: 5000, category: "Shoes", description: "Running shoes" },
  { _id: "2", name: "Adidas Sneakers", price: 6000, category: "Shoes", description: "Sports sneakers" },
  { _id: "3", name: "Apple iPhone", price: 120000, category: "Electronics", description: "Latest iPhone" },
  { _id: "4", name: "Samsung TV", price: 40000, category: "Electronics", description: "Smart TV 42 inch" },
  { _id: "5", name: "Levi's Jeans", price: 2500, category: "Clothing", description: "Denim jeans" }
];

function UserProductPage() {
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   setProducts(seedProducts);
  // }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-center">Product Catalog</h1>
      <p className="text-center text-gray-600 mb-6">Browse products available for purchase 🚀</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-gray-800 mb-1"><span className="font-bold">Price:</span> ₹{product.price}</p>
              <p className="text-gray-600 mb-1"><span className="font-bold">Category:</span> {product.category}</p>
              <p className="text-gray-500">{product.description}</p>
            </div>
            <button className="mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserProductPage;
