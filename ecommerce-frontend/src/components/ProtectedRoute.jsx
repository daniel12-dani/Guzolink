import { Navigate } from "react-router-dom";
import { useProducts } from "../context/products";

function ProtectedRoute({ children }) {
  const { user } = useProducts();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
