import { MdCheck } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

/**
 * PaymentSuccessModal component displays a modal indicating a successful payment.
 * It provides a message to the user and navigates to the appropriate page upon closing the modal.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onHide - Function to handle closing the modal.
 * @returns {JSX.Element} The rendered payment success modal.
 */
export const PaymentSuccessModal = ({ show, onHide }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const handleClose = () => {
    if (location.pathname === "/app/user-checkout") {
      navigate("/app/dashboard");
    } else if (location.pathname === "/app/add-user-checkout") {
      navigate("/app/additional-users");
    } else {
      window.location.href = "/app/subscriptions";
      
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="paymentSuccessModal">
      <Modal.Body className="text-center">
        <span className="modal-icon modal-icon-bg">
          <MdCheck />
        </span>
        <p className="modal-head global-heading">{t("userCheckout.success")}</p>
        <span>{t("userCheckout.your_payment")}</span>
        <div className="modal-btns justify-content-center">
          <button
            type="button"
            title="OK"
            className="button modal-btn-bg ok-btn"
            data-bs-dismiss="modal"
            onClick={handleClose}
          >
            {t("userCheckout.ok")}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
