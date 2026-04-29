import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { clearToken } from "../slices/authSlice";
import { useEffect } from "react";

/**
 * PrivateRoute component to protect routes that require authentication.
 * It checks if the user is authenticated and if the token has expired.
 * If the user is not authenticated or the token has expired, they are redirected to the login page.
 *
 * @param {React.Node} children - The child components that will be rendered if authenticated.
 * @returns {React.Element} - Redirects to login page if not authenticated or token has expired, otherwise renders the children.
 */
const isTokenExpired = () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  if (!tokenExpiry) return true;

  try {
    return Date.now() > parseInt(tokenExpiry);
  } catch (error) {
    console.error("Error parsing token expiry:", error);
    return true;
  }
};

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    if (isTokenExpired()) {
      dispatch(clearToken());
    }
  }, [dispatch]);

  const from =
    (location.state && location.state.from && location.state.from.pathname) ||
    "/";

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from }} replace />
  );
};

export default PrivateRoute;
