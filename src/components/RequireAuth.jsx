// ログインしていなければ /login に移動させる
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

const RequireAuth = ({ children }) => {
  const { email } = useAuth();
  if (!email) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAuth;
