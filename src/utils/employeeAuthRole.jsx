import { useEffect, useState } from "react";
import { getUserDetails } from "../services/user";
import { Navigate } from "react-router-dom";

/**
 * EmployeeRoute component is a higher-order component that checks the user's role.
 * If the user is an employee, they are redirected to the dashboard.
 * If the user role is not "employee", the child components are rendered.
 *
 * @param {Object} props - The component props.
 * @param {JSX.Element} props.children - The child components to render if the user is not an employee.
 * @returns {JSX.Element} The rendered component or a redirect to the dashboard.
 */
const EmployeeRoute = ({ children }) => {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserDetails();
      setLoading(true);
      if (response?.code == "200") {
        setUserRole(response?.user?.user_role);
      }
      setLoading(false);
    };
    fetchData();
  }, [getUserDetails]);

  if (loading) {
    return <div className="text-center">...</div>;
  }

  if (userRole === "employee") {
    return <Navigate to="/app/dashboard" />;
  }

  return children;
};

export default EmployeeRoute;
