import { Modal } from "react-bootstrap";
import { useOutletContext } from "react-router-dom";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { addUserInvitation } from "../../services/additionalUser";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { SignupSchema } from "../../schema";
import { SUCCESS } from "../../config/constant";

/**
 * AddUserModal Component
 *
 * A modal component that allows inviting a user by entering their email and an optional message.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.show - Determines whether the modal is visible.
 * @param {Function} props.onRequestClose - Function to close the modal.
 *
 * @returns {JSX.Element} The rendered AddUserModal component.
 */
export const AddUserModal = ({ show, onRequestClose }) => {
  const { t } = useOutletContext();
  const [business_id, setBusinessId] = useState("");

  const usersData = useSelector((state) => state.user);

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setBusinessId(users.business_details[0]?._id);
    }
  }, [usersData]);

  const {
    sent_successfully,
    addUser,
    email,
    enter_email,
    cancel,
    send_invite,
    message,
    enter_message,
    invited_register,
    error_occurred,
    unexpected_error,
  } = t("userComponent");

  const validation = SignupSchema(t("validations"));

  const formik = useFormik({
    initialValues: {
      email: "",
      message: invited_register,
    },

    validationSchema: validation,

    onSubmit: async (values, { resetForm }) => {
      const language = localStorage.getItem("language");
      const userData = {
        ...values,
        business_id: business_id,
        lang: language,
      };
      try {
        const response = await addUserInvitation(userData);
        if (response.success) {
          toast.success(sent_successfully);
          resetForm();
          onRequestClose();
        }
      } catch (error) {
        error.response
          ? toast.error(error.response.data.message || error_occurred)
          : toast.error(unexpected_error);
      }
    },
  });

  const handleClose = () => {
    onRequestClose();
  };

  return (
    <Modal
      show={show}
      onHide={onRequestClose}
      centered
      animation={true}
      className="add-user--modal"
    >
      <Modal.Header closeButton onClick={onRequestClose}>
        <Modal.Title>
          <h5 className="modal-title global-heading">{addUser}</h5>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body className="d-grid gap-4">
          <div>
            <label htmlFor="email" className="form-label">
              {email}
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={enter_email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="error">{formik.errors.email}</div>
            )}
          </div>
          <div>
            <label htmlFor="uMessage" className="form-label">
              {message}
            </label>
            <textarea
              className="form-control"
              id="message"
              rows="6"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder={enter_message}
            ></textarea>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            title="Cancel"
            className="button close-btn"
            data-bs-dismiss="modal"
            onClick={handleClose}
          >
            {cancel}
          </button>
          <button type="submit" title="Send Invite" className="button">
            {send_invite}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
