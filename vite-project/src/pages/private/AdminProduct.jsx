import "../../App.css";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function AdminUserProducts() {
  // ✅ Seed products (pre-filled like Daraz)
  const seedProducts = [
    { _id: "1", name: "Nike Shoes", price: 5000, category: "Shoes", description: "Running shoes" },
    { _id: "2", name: "Adidas Sneakers", price: 6000, category: "Shoes", description: "Sports sneakers" },
    { _id: "3", name: "Apple iPhone", price: 120000, category: "Electronics", description: "Latest iPhone" },
    { _id: "4", name: "Samsung TV", price: 40000, category: "Electronics", description: "Smart TV 42 inch" },
    { _id: "5", name: "Levi's Jeans", price: 2500, category: "Clothing", description: "Denim jeans" }
  ];

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // 🔄 Load products on page load
  useEffect(() => {
    setProducts(seedProducts);
  }, []);

  // ➕ ADD / ✏️ UPDATE product
  const onSubmit = (data) => {
    if (editingId) {
      // Edit existing product
      setProducts(products.map(p => p._id === editingId ? { ...p, ...data } : p));
    } else {
      // Add new product
      setProducts([...products, { ...data, _id: Date.now().toString() }]);
    }
    reset();
    setEditingId(null);
  };

  // ✏️ Edit product
  const handleEdit = (product) => {
    setEditingId(product._id);
    reset(product); // fill form with existing data
  };

  // ❌ Delete product
  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(products.filter(p => p._id !== id));
  };

  // 📊 Data table columns
  const columns = [
    { name: "Name", selector: row => row.name, sortable: true },
    { name: "Price", selector: row => row.price, sortable: true },
    { name: "Category", selector: row => row.category, sortable: true },
    { name: "Description", selector: row => row.description },
    {
      name: "Actions",
      cell: row => (
        <>
          <button onClick={() => handleEdit(row)} style={{ marginRight: "5px" }}>Edit</button>
          <button onClick={() => handleDelete(row._id)}>Delete</button>
        </>
      )
    }
  ];

  return (
    <div className="product-page">
      <h1>Product Catalog</h1>
      <p>Mini Daraz-style product page 🚀</p>

      {/* 📝 Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="product-form">
        <input
          placeholder="Product name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          type="number"
          placeholder="Price"
          {...register("price", { required: "Price is required" })}
        />
        {errors.price && <p className="error">{errors.price.message}</p>}

        <input
          placeholder="Category"
          {...register("category", { required: "Category is required" })}
        />
        {errors.category && <p className="error">{errors.category.message}</p>}

        <textarea
          placeholder="Description"
          {...register("description")}
        />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* 📊 Data Table */}
      <DataTable
        columns={columns}
        data={products}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}

export default AdminUserProducts;
