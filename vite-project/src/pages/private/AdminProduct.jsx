import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products/admin/products", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 403) {
          alert("You are not authorized to access this page.");
          return navigate("/product"); // redirect non-admins
        }

        const data = await res.json();
        setProducts(data.data);
      } catch (err) {
        console.error(err);
        navigate("/product");
      }
    };

    fetchAdminProducts();
  }, [navigate]);

  return (
    <div>
      <h1>Admin Product Page</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - {p.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductPage;
