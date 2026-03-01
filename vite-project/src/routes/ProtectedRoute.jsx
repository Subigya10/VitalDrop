import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, adminFallback }) => {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role");

  if (!user) return <Navigate to="/login" replace />;

  if (adminFallback && role === "admin") return <Navigate to={adminFallback} replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;