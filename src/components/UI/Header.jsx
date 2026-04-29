import { Link, NavLink, useNavigate } from "react-router-dom";
import { LanguageToggle } from "./LanguageToggle";
import { MdMenu } from "react-icons/md";
import { SlideNavigation } from "./SlideNavigation";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../slices/authSlice";

/**
 * Header component renders the navigation header for the application.
 * It includes links to different sections, user authentication options, and a language toggle.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.t - Translation function for internationalization.
 * @returns {JSX.Element} The rendered header component.
 */
export const Header = ({ t }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { home, about, services, contact, log_reg, log_out, go_to_dashboard } =
    t("header");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isRegistered = localStorage.getItem("isRegistered") === "true";

  const handleLogout = async () => {
    dispatch(clearToken());
    navigate("/login");
  };

  return (
    <header className="position-sticky top-0 z-3 bg-white">
      <div className="wrapper d-flex align-items-center">
        <Link to="/" title="Resident Review">
          <img
            src={logo}
            alt="Resident Review"
            width={140}
            height={62.28}
            className="img-fluid logo"
          />
        </Link>
        <nav className="gap-4 mx-auto">
          <NavLink to="/" title={home}>
            {home}
          </NavLink>
          <NavLink to="/about" title={about}>
            {about}
          </NavLink>
          <NavLink to="/services" title={services}>
            {services}
          </NavLink>
          <NavLink to="/contact" title={contact}>
            {contact}
          </NavLink>
        </nav>
        <div className="d-flex align-items-center">
          <LanguageToggle />
          {isAuthenticated && isRegistered ? (
            <div>
              <Link
                to="/app/dashboard"
                title={go_to_dashboard}
                className="button headerDashboard"
              >
                {go_to_dashboard}
              </Link>
            </div>
          ) : (
            ""
          )}
          {isAuthenticated ? (
            <div>
              <Link
                to="/login"
                title={log_out}
                className="button"
                onClick={handleLogout}
              >
                {log_out}
              </Link>
            </div>
          ) : (
            <Link to="/login" title={log_reg} className="button">
              {log_reg}
            </Link>
          )}
        </div>
        <MdMenu
          className="hamburger"
          data-bs-toggle="offcanvas"
          data-bs-target="#slideNavigation"
          role="menu"
          aria-controls="slideNavigation"
        />
      </div>
      <SlideNavigation />
    </header>
  );
};
