import { MdClose } from "react-icons/md";
import { Modal, Button } from "react-bootstrap";
import { cancelSubscriptionApis } from "../../services/subscription";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";

/**
 * CancelSubscriptionModal component displays a modal when you are canceling the subscription plan.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @returns {JSX.Element} The rendered cancel subscription modal.
 */
export const CancelSubscriptionModal = ({
  show,
  onRequestClose,
  subscriptionId,
}) => {
  const { t } = useOutletContext();

  const cancelSubscription = async () => {
    const response = await cancelSubscriptionApis({
      subscriptionId: subscriptionId,
    });
    if (response.statusCode != 200) {
      toast.error(went_wrong);
      return;
    }
    onRequestClose();
    window.location.reload();
  };

  const { deleteSubscriptionHeading, deleteConfirmation, cancel, yes } = t(
    "subscriptionComponent"
  );

  const { went_wrong } = t("userCheckout");

  return (
    <Modal
      show={show}
      onHide={onRequestClose}
      animation={true}
      centered
      className="delete_customer_modal"
    >
      <Modal.Body className="text-center modal-box">
        <span className="modal-icon">
          <MdClose />
        </span>
        <p className="modal-head global-heading">{deleteSubscriptionHeading}</p>
        <span>{deleteConfirmation} ?</span>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={onRequestClose}
          >
            {cancel}
          </Button>
          <Button
            variant="danger"
            className="button"
            onClick={cancelSubscription}
          >
            {yes}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
