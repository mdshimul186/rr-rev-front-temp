import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { BusinessRegistration } from "./pages/login-flow/BusinessRegistration";
import { Login } from "./pages/login-flow/Login";

export const BusinessRegistrationRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isBusinessRegistered = localStorage.getItem("isRegistered");

  if (isBusinessRegistered === null) {
    console.error("Error: Registration status could not be retrieved.");
    return <Navigate to="/error" />;
  }

  if (!isAuthenticated) return <Login />;
  if (isBusinessRegistered === "true") return <Navigate to="/app/dashboard" />;

  return <BusinessRegistration />;
};
