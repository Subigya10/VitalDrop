import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Dashboard   = React.lazy(() => import("../pages/private/Dashboard.jsx"));
const Profile     = React.lazy(() => import("../pages/private/Profile.jsx"));
const Activity    = React.lazy(() => import("../pages/private/Activity.jsx"));
const Emergency   = React.lazy(() => import("../pages/private/Emergency.jsx"));
const Nearby      = React.lazy(() => import("../pages/private/Nearby.jsx"));
const Settings    = React.lazy(() => import("../pages/private/Settings.jsx"));
const Donate      = React.lazy(() => import("../pages/private/Donate.jsx"));
const DonorSearch = React.lazy(() => import("../pages/private/DonorSearch.jsx"));
const Leaderboard = React.lazy(() => import("../pages/private/Leaderboard.jsx"));
const AdminDashboard = React.lazy(() => import("../pages/private/AdminDashboard.jsx"));

const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-950">
    <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const PrivateRoutes = () => (
  <Suspense fallback={<Spinner />}>
    <Routes>
      {/* USER ONLY — admins get bounced to /admin */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} adminFallback="/admin" />}>
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/profile"     element={<Profile />} />
        <Route path="/activity"    element={<Activity />} />
        <Route path="/emergency"   element={<Emergency />} />
        <Route path="/nearby"      element={<Nearby />} />
        <Route path="/settings"    element={<Settings />} />
        <Route path="/donate"      element={<Donate />} />
        <Route path="/donors"      element={<DonorSearch />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>

      {/* ADMIN ONLY — users get bounced to /dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all: redirect based on role */}
      <Route path="*" element={<RoleRedirect />} />
    </Routes>
  </Suspense>
);

const RoleRedirect = () => {
  const role = localStorage.getItem("role");
  return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
};

export default PrivateRoutes;