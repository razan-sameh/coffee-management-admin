import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ redirectTo }: { redirectTo: string }) => {
  const uid = useSelector((state: RootState) => state.auth.user?.Uid);

  return uid ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
