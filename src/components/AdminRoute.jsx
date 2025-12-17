import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;

  if (user.role !== "Admin") {
    return <Navigate to="/app/profil" replace />;
  }

  return children;
}

export default AdminRoute;
