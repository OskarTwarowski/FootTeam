import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const userRole = useSelector((state) => state.auth.user?.Role);

  if (userRole !== "Admin") {
    return <Navigate to="/app/profil" replace />;
  }

  return children;
}

export default AdminRoute;
