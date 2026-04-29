import { useNavigate, useOutletContext } from "react-router-dom";
import success from "../../assets/images/success.png";
import { Modal } from "react-bootstrap";

/**
 * VerificationModal component displays a modal to inform the user that their account has been verified.
 * It provides a message and a button to continue to the login page.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onHide - Function to handle closing the modal.
 * @returns {JSX.Element} The rendered verification modal.
 */
export const VerificationModal = ({ show, onHide }) => {
  const t = useOutletContext();
  const navigate = useNavigate();
  const { continue_text } = t("verification");
  const { account_verify } = t("verification_modal");

  const handleClose = () => {
    localStorage.removeItem("contact");
    navigate("/login");
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      animation={true}
      className="verificationModal"
    >
      <Modal.Body className="text-center">
        <img
          src={success}
          alt="Success"
          width={60}
          height={60}
          className="img-fluid"
        />
        <p className="verification-msg">{account_verify}</p>
        <button
          type="button"
          title={continue_text}
          className="button w-100 m-0"
          onClick={handleClose}
        >
          {continue_text}
        </button>
      </Modal.Body>
    </Modal>
  );
};
