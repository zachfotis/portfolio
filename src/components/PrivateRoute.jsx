import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Spinner from './Spinner';

function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  } else {
    return loggedIn ? <Outlet /> : <Navigate to="/log-in" />;
  }
}

export default PrivateRoute;
