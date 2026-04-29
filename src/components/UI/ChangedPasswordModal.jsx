import { useNavigate } from "react-router-dom";
import lock from "../../assets/images/lock.png";
import { useTranslation } from "react-i18next";

/**
 * ChangedPasswordModal component displays a modal when the password is changed successfully.
 *
 * @returns {JSX.Element} The rendered changed password modal.
 */
export const ChangedPasswordModal = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="modal fade"
      id="changedPasswordModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex="-1"
      aria-labelledby="changedPasswordModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered verification-dialog">
        <div className="modal-content">
          <div className="modal-body text-center">
            <img
              src={lock}
              alt="Changed Password"
              width={60}
              height={60}
              className="img-fluid"
            />
            <p className="check-mail">
              {t("reset_password.changed_successfully")}
            </p>
            <p>{t("reset_password.successfully_updated")}</p>
            <button
              type="button"
              className="button w-100 m-0"
              title="Login"
              data-bs-dismiss="modal"
              onClick={goToLogin}
            >
              {t("login.login_text")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
