import {
  MdCurrencyExchange,
  MdOutlineAccountCircle,
  MdOutlineAnalytics,
  MdOutlineBallot,
  MdOutlineDashboard,
  MdOutlineGroup,
} from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/logo2.png";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import search from "../../assets/images/search.png";
import facebookIcon from "../../assets/images/facebook.png";
import instagramIcon from "../../assets/images/instagram.png";
import { useTranslation } from "react-i18next";
import { SUCCESS } from "../../config/constant";

/**
 * SideNavigation component renders a sidebar navigation menu for the application.
 * It includes links to various sections based on the user's role and displays social media links.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.collapse - State indicating if the sidebar is collapsed.
 * @returns {JSX.Element} The rendered side navigation component.
 */
export const SideNavigation = ({ collapse }) => {
  const { t } = useTranslation();
  const [business_id, setBusinessId] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [googleLink, setGoogleLink] = useState("");
  const navigate = useNavigate();

  const usersData = useSelector((state) => state.user);

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setEmployeeRole(users?.user?.user_role);
      setBusinessId(users.business_details[0]?._id);
      setFacebookLink(users.business_details[0].facebook);
      setInstagramLink(users.business_details[0].instagram);
      setGoogleLink(users.business_details[0].google);
    }
  }, [usersData]);

  const handleProfile = async () => {
    if (business_id) {
      setTimeout(() => {
        navigate("/app/business-profile", { state: { business_id } });
      }, 50);
    } else {
      console.error("business_id is null or undefined");
    }
  };

  return (
    <section
      className={`side-navigation position-fixed start-0 bg-white text-center ${
        collapse ? "collapsed-nav" : ""
      }`}
    >
      <Link to="/" target="_self" title="Resident Review">
        <img
          src={logo}
          alt="Resident Review"
          width={140}
          height={62.28}
          className={`img-fluid logo ${collapse ? "hide-logo" : ""}`}
        />
      </Link>
      <Link to="/" target="_self" title="Resident Review">
        <img
          src={logo2}
          alt="Resident Review"
          width={55}
          height={30.84}
          className={`img-fluid logo ${collapse ? "" : "hide-logo"}`}
        />
      </Link>
      <nav className="flex-column">
        <NavLink to="/app/dashboard" title="Dashboard">
          <MdOutlineDashboard />
          <span> {t("sideNavigation.dashboard")}</span>
        </NavLink>
        {employeeRole !== "employee"
          ? [
              <NavLink
                key="customer-list"
                to="/app/customer-list"
                title="Customer List"
              >
                <MdOutlineBallot />
                <span>{t("sideNavigation.customer_list")}</span>
              </NavLink>,
            ]
          : []}
        {employeeRole !== "employee"
          ? [
              <NavLink
                key="subscriptions"
                to="/app/subscriptions"
                title="Subscriptions"
              >
                <MdCurrencyExchange />
                <span>{t("sideNavigation.subscriptions")}</span>
              </NavLink>,
            ]
          : []}
        <NavLink to="/app/business-profile" title="Business Profile">
          <MdOutlineAccountCircle />
          <span onClick={handleProfile}>
            {t("sideNavigation.business_profile")}
          </span>
        </NavLink>
        {employeeRole !== "employee"
          ? [
              <NavLink
                key="additional-users"
                to="/app/additional-users"
                title="Additional Users"
              >
                <MdOutlineGroup />
                <span>{t("sideNavigation.additional_users")}</span>
              </NavLink>,
            ]
          : []}
        <NavLink to="/app/analytics" title="Analytics">
          <MdOutlineAnalytics />
          <span>{t("privacyPolicy.analytics")}</span>
        </NavLink>
        <div className="d-flex gap-2 SideiconWrapper">
          {facebookLink && (
            <span>
              {" "}
              <a href={facebookLink} target="_blank">
                <img
                  className="socialIcon"
                  src={facebookIcon}
                  alt="instagram icon"
                />
              </a>
            </span>
          )}
          {instagramLink && (
            <span className="mx-2">
              {" "}
              <a href={instagramLink} target="_blank">
                <img
                  className="socialIcon"
                  src={instagramIcon}
                  alt="instagram icon"
                />
              </a>
            </span>
          )}
          {googleLink && (
            <span>
              {" "}
              <a href={googleLink} target="_blank">
                <img className="socialIcon" src={search} alt="instagram icon" />
              </a>
            </span>
          )}
        </div>
      </nav>
    </section>
  );
};
