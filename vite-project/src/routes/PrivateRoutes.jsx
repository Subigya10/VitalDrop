import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const ProductPage = React.lazy(() => import("../pages/private/Product"));
const AdminProductPage = React.lazy(() => import("../pages/private/AdminProduct"));

const PrivateRoutes = () => {
  const role = localStorage.getItem("role"); // get role from localStorage

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* All users can access their own product page */}
        <Route path="/product" element={<ProductPage />} />

        {/* Only admins can access admin product page */}
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
