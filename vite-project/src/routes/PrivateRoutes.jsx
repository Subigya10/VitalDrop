import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // ← ADD THIS

const Dashboard = React.lazy(() => import("../pages/private/Dashboard.jsx"));
const AdminProductPage = React.lazy(() => import("../pages/private/AdminProduct.jsx"));
const Profile = React.lazy(() => import("../pages/private/Profile.jsx"));
const Activity = React.lazy(() => import("../pages/private/Activity.jsx"));

const PrivateRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Protected: Anyone logged in can access Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
        </Route>

        {/* Protected: Admin only */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/adminproduct" element={<AdminProductPage />} />
        </Route>

        {/* Default route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default PrivateRoutes;