import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createBusinessRegister, getUserDetails } from "../../services/user";
import { clearRegisterCounter } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";


/**
 * MiddeskBusinessRegistrationModal component displays a modal when there is an error in business registration in sequence more than twice.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {Object} props.UpdatedBusinessRegistrationInfo - Contains the updated business registration data.
 * @returns {JSX.Element} The rendered business registration modal.
 */
export const MiddeskBusinessRegistrationModal = ({
  show,
  onRequestClose,
  UpdatedBusinessRegistrationInfo,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const closeModel = () => {
    onRequestClose();
  };

  const handleSubmit = async () => {
    if (!UpdatedBusinessRegistrationInfo) return;
    let payload = {
      ...UpdatedBusinessRegistrationInfo,
      with: "NO",
    };
    const response = await createBusinessRegister(payload);
    if (response.success) {
      dispatch(clearRegisterCounter());
      getUserDetails();
      navigate("/app/dashboard");
    }
  };

  return (
    <Modal
      show={show}
      onHide={onRequestClose}
      animation={true}
      centered
      className="delete_customer_modal"
    >
      <Modal.Body className="text-center modal-box">
        <p className="modal-head">{t("business_registration.admin_review")}</p>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={closeModel}
          >
            {t("business_registration.cancel")}
          </Button>
          <Button variant="danger" className="button" onClick={handleSubmit}>
            {t("customerComponent.yes")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
