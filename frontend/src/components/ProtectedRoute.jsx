import { Navigate, useLocation } from "react-router";
import useAuth from "../context/useAuth";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="page">
        <Loading>جاري التحميل...</Loading>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== "ADMIN") {
    return (
      <main className="page">
        <EmptyState icon="lock">
          غير مسموح. ليس لديك صلاحية لدخول الصفحة دي.
        </EmptyState>
      </main>
    );
  }

  return children;
}
