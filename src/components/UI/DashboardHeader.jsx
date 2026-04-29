import { useState, useEffect } from "react";
import { MdMenu, MdOutlineEdit } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { clearToken } from "../../slices/authSlice";
import logo2 from "../../assets/images/logo2.png";
import { getUserDetails } from "../../services/user";
import { getBusinessDetails } from "../../services/customer";
import { getUsersData } from "../../slices/userSlice";
import { IMG_API_BASE_URL } from "../../config/config";
import { t } from "i18next";
import { LanguageToggle } from "./LanguageToggle";
import { SUCCESS } from "../../config/constant";

/**
 * DashboardHeader component provides a navigation header for the dashboard.
 * It includes user profile options, business details, and logout functionality.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.collapse - State indicating if the sidebar is collapsed.
 * @param {Function} props.setCollapse - Function to toggle the sidebar collapse state.
 * @returns {JSX.Element} The rendered dashboard header.
 */

export const Dashboardheader = ({ collapse, setCollapse }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const usersData = useSelector((state) => state.user);
  const [users, setUsers] = useState(null);
  const [business_id, setBusinessId] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [businessDetails, setBusinessDetails] = useState([]);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const userfirstName = users?.user?.first_name.replace(
    users?.user?.first_name[0],
    users?.user?.first_name[0].toUpperCase()
  );

  const handleLogout = async () => {
    dispatch(clearToken());
    navigate("/login");
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    dispatch(getUsersData(userDetailsData));
    setBusinessId(userDetailsData.business_details[0]?._id);
    setEmployeeRole(userDetailsData?.user?.user_role);
  };

  const fetchBusinessDetails = async () => {
    try {
      const businessDetailsData = await getBusinessDetails(business_id);
      setBusinessDetails(businessDetailsData.data);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setBusinessDetails("");
    }
  };

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setUsers({ ...users });
      setBusinessId(users?.business_details[0]?._id);
      setEmployeeRole(users?.user?.user_role);
    } else if (status == null) {
      getUserDetail();
    }
  }, [usersData]);

  useEffect(() => {
    if (location.pathname === "/app/dashboard" && business_id) {
      fetchBusinessDetails();
    }
  }, [business_id, location.pathname]);

  const handleProfile = async () => {
    if (business_id) {
      navigate("/app/business-profile");
    }
  };

  const closeModal = () => {
    setChangePasswordModal(false);
  };

  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };

  const handleEditProfile = async () => {
    if (business_id) {
      navigate("/app/business-profile");
    }
  };

  const pathname = location.pathname;
  const segments = pathname.split("/").filter((segment) => segment.length > 0);

  const lastSegment = segments[segments.length - 1];
  const isId = /^[a-f0-9]{24}$/i.test(lastSegment);

  let title = "";
  if (isId) {
    const secondToLastSegment = segments[segments.length - 2];
    title =
      secondToLastSegment.charAt(0).toUpperCase() +
      secondToLastSegment.slice(1).toLowerCase();
  } else {
    title =
      lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).toLowerCase();
  }

  return (
    <>
      <title>{title} - Resident Review</title>
      <header
        className={`p-2 d-flex align-items-center justify-content-between position-sticky top-0 bg-white dashboard-header left-spacing ${
          collapse ? "expand" : ""
        }`}
      >
        <Link to="#" onClick={() => setCollapse(!collapse)} className="">
          <MdMenu className="hamburger d-block" />
        </Link>
        {location.pathname == "/app/dashboard" ? (
          <>
            <div className="headerLogo">
              <div className="business-profile d-flex flex-wrap align-items-center px-3">
                {businessDetails.company_logo && (
                  <div className="businessProfileImage" width={80} height={60}>
                    <img
                      src={
                        businessDetails.company_logo
                          ? `${IMG_API_BASE_URL}${businessDetails.company_logo}`
                          : logo2
                      }
                      alt="RRLogo"
                      width={80}
                      height={80}
                      className="img-fluid"
                    />
                  </div>
                )}

                <div className="headerBusiness">
                  <h5 className="mb-0 text-break">
                    {businessDetails.business_name}
                  </h5>
                  <div className="d-flex flex-wrap align-items-center mt-2 business_details"></div>
                </div>
                {employeeRole === "employee" ? (
                  ""
                ) : (
                  <button
                    onClick={handleEditProfile}
                    title="Edit Profile"
                    className="button ms-auto rounded-pill position-relative mt-0 mb-0"
                  >
                    <span>
                      <MdOutlineEdit />
                    </span>
                    {t("customerSearch.edit_profile")}{" "}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
        <div className="d-flex align-item-center">
          <div className="dropdown user-dropdown">
            <Link
              className="btn dropdown-toggle border-0 d-flex align-items-center p-0"
              to="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {businessDetails.company_logo && (
                <div className="businessProfileImage profileImage">
                  {users && (
                    <img
                      src={
                        users?.business_details[0]?.company_logo
                          ? `${IMG_API_BASE_URL}${users?.business_details[0]?.company_logo}`
                          : logo2
                      }
                      alt="RRLogo"
                      width={40}
                      height={40}
                      className=""
                    />
                  )}
                </div>
              )}
              {users && (
                <span>
                  {userfirstName} {users?.user?.last_name}
                </span>
              )}
            </Link>
            <ul className="dropdown-menu">
              <li className="d-none">
                <LanguageToggle />
              </li>
              <li>
                <Link
                  title="Business Profile"
                  className="dropdown-item"
                  onClick={handleProfile}
                  to="/app/business-profile"
                >
                  {t("sideNavigation.business_profile")}{" "}
                </Link>
              </li>
              <li>
                <button
                  title="Change Password"
                  className="dropdown-item"
                  onClick={handleChangePassword}
                >
                  {t("sideNavigation.change_password")}
                </button>
              </li>
              <li>
                <Link
                  title="Logout"
                  className="dropdown-item"
                  onClick={handleLogout}
                >
                  {t("header.log_out")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <ChangePasswordModal
        show={changePasswordModal}
        onRequestClose={closeModal}
      />
    </>
  );
};
