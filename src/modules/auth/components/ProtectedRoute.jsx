import { Navigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirigir a home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
