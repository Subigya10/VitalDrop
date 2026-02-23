import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log("🔒 ProtectedRoute checking user:", user); // ← ADD THIS

  if (!user) {
    console.log("❌ No user found, redirecting to login"); // ← ADD THIS
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("❌ Wrong role, redirecting to dashboard"); // ← ADD THIS
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ User authorized, showing page"); // ← ADD THIS
  return <Outlet />;
};

export default ProtectedRoute;