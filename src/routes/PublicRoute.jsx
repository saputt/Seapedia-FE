import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
