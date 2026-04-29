import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Login } from "./pages/login-flow/Login";

const LoginCheckRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isRegistered = useSelector((state) => state.user.isBusinessRegistered);

  if (isAuthenticated && isRegistered) {
    <Navigate to="/app/dashboard" />;
  } else {
    <Login />;
  }
};

export default LoginCheckRoute;
