import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ProductPage = React.lazy(() => import("../pages/private/Product.jsx"));
const AdminProductPage = React.lazy(() => import("../pages/private/AdminProduct.jsx"));

const PrivateRoutes = () => {
  const role = localStorage.getItem("role");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Only regular users can access /product, admins get redirected */}
        <Route 
          path="/product" 
          element={role === "admin" ? <Navigate to="/adminproduct" /> : <ProductPage />} 
        />

        {/* Only admins can access /adminproduct, users get redirected */}
        <Route
          path="/adminproduct"
          element={role === "admin" ? <AdminProductPage /> : <Navigate to="/product" />}
        />

        {/* Default route: redirect based on role */}
        <Route
          path="*"
          element={<Navigate to={role === "admin" ? "/adminproduct" : "/product"} />}
        />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;