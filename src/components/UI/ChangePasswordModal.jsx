import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { newPassword } from "../../schema";
import { Modal } from "react-bootstrap";
import { userResetPassword } from "../../services/user";
import { toast } from "react-toastify";

/**
 * ChangePasswordModal component displays a modal when user is set new password.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @returns {JSX.Element} The rendered change password modal.
 */
export const ChangePasswordModal = ({ show, onRequestClose }) => {
  const { t } = useTranslation();
  const language = localStorage.getItem("language");

  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validation = newPassword(t("validations"));

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      mNewPassword: "",
      mConfirmNewPassword: "",
    },

    validationSchema: validation,

    onSubmit: async (values) => {
      try {
        const response = await userResetPassword({
          oldpassword: values.oldPassword,
          password: values.mNewPassword,
        });
        if (response.data.success) {
          toast.success(response.data.data.message[language]);
        }
        closeModal();
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    },
  });

  const closeModal = () => {
    onRequestClose();

    formik.resetForm();
  };

  return (
    <Modal
      show={show}
      onHide={closeModal}
      centered
      animation
      className="add-user--modal change-password-modal"
    >
      <Modal.Header>
        <Modal.Title>{t("sideNavigation.change_password")}</Modal.Title>
      </Modal.Header>

      <form onSubmit={formik.handleSubmit}>
        <Modal.Body className="d-grid gap-2">
          {[
            {
              field: "oldPassword",
              label: "sideNavigation.old_password",
              placeholder: "sideNavigation.your_old",
            },

            {
              field: "mNewPassword",
              label: "reset_password.new_password",
              placeholder: "reset_password.enter_new_password",
            },

            {
              field: "mConfirmNewPassword",
              label: "reset_password.confirm_new_password",
              placeholder: "reset_password.enter_new_confirm_password",
            },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label htmlFor={field} className="form-label">
                {t(label)}
              </label>
              <div className="position-relative mt-0">
                <input
                  type={passwordVisibility[field] ? "text" : "password"}
                  className="form-control password-field"
                  id={field}
                  name={field}
                  placeholder={t(placeholder)}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  autoComplete="off"
                />
                {passwordVisibility[field] ? (
                  <MdOutlineVisibility
                    onClick={() => togglePasswordVisibility(field)}
                    className="eye-icon"
                  />
                ) : (
                  <MdOutlineVisibilityOff
                    onClick={() => togglePasswordVisibility(field)}
                    className="eye-icon"
                  />
                )}
              </div>

              {formik.touched[field] && formik.errors[field] && (
                <span className="error">{formik.errors[field]}</span>
              )}
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="button close-btn"
            data-bs-dismiss="modal"
            onClick={closeModal}
          >
            {t("business_registration.cancel")}
          </button>

          <button type="submit" className="button">
            {t("sideNavigation.update")}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
