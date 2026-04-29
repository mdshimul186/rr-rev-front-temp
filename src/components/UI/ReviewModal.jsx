import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

/**
 * ReviewModal component displays a modal indicating that a review is in pending stage.
 * It provides a message to the user and includes an option to close the modal.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onRequestClose - Function to handle closing the modal.
 * @param {Function} props.setShowReviewModal - Function to update the state of the review modal visibility.
 * @returns {JSX.Element} The rendered review modal.
 */
export const ReviewModal = ({ show, onRequestClose, setShowReviewModal }) => {
  const { t } = useTranslation();
  const handleClose = () => {
    setShowReviewModal(false);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onRequestClose}
        centered
        className="paymentSuccessModal"
      >
        <Modal.Body className="text-center">
          <span>{t("customerSearch.reviewed_approved")}</span>
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
    </>
  );
};
