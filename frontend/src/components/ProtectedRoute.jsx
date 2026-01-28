import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isLoggedIn, authReady } = useAuth();

  if (!authReady) return null; // or loader

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
