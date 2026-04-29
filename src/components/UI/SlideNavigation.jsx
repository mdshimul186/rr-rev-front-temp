import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

export const SlideNavigation = () => {
  const { t } = useTranslation();
  const { home, about, services, contact, log_reg } = t("header");
  
  return (
    <div
      className="offcanvas offcanvas-start"
      data-bs-scroll="true"
      tabIndex="-1"
      id="slideNavigation"
      aria-labelledby="slideNavigationLabel"
    >
      <div className="offcanvas-header">
        <Link
          to="/"
          title="Resident Review"
          className="offcanvas-title"
          id="slideNavigationLabel"
        >
          <img
            src={logo}
            alt="Resident Review"
            width={140}
            height={62.28}
            className="img-fluid logo"
          />
        </Link>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <nav className="d-flex flex-column gap-4">
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
        <Link
          to="/login"
          title={log_reg}
          className="button d-inline-block"
        >
          {log_reg}
        </Link>
      </div>
    </div>
  );
};
