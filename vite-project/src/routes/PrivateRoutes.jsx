import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // ← ADD THIS

const Dashboard = React.lazy(() => import("../pages/private/Dashboard.jsx"));
const AdminProductPage = React.lazy(() => import("../pages/private/AdminProduct.jsx"));
const Profile = React.lazy(() => import("../pages/private/Profile.jsx"));
const Activity = React.lazy(() => import("../pages/private/Activity.jsx"));
const Emergency = React.lazy(() => import("../pages/private/Emergency.jsx"));
const Nearby = React.lazy(() => import("../pages/private/Nearby.jsx"));
const Settings = React.lazy(() => import("../pages/private/Settings.jsx"));
const Donate = React.lazy(() => import("../pages/private/Donate.jsx")); 
const About = React.lazy(() => import("../pages/public/About.jsx"));

const PrivateRoutes = () => {
  return (
    <Suspense fallback={
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
}>
      <Routes>
        {/* Protected: Anyone logged in can access Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/donate" element={<Donate />} />
          
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