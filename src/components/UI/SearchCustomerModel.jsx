import { Modal } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

/**
 * SearchCustomerModal component displays a modal indicating that customer reviews are being searched.
 * It provides a button to navigate to the subscriptions page for upgrading the subscription.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onRequestClose - Function to handle closing the modal.
 * @returns {JSX.Element} The rendered search customer modal.
 */
export const SearchCustomerModel = ({ show, onRequestClose }) => {
  const { t } = useOutletContext();
  const navigate = useNavigate();
  const { upgrade_subscription } = t("subscriptionComponent");

  return (
    <Modal
      show={show}
      onHide={onRequestClose}
      animation={true}
      centered
      size="md"
      className="searchModel"
    >
      <Modal.Header className="searchHeader" closeButton></Modal.Header>
      <Modal.Body className="text-center modal-box searchBody">
        <p className="modal-head">{t("customerSearch.searching_reviews")}</p>
        <button
          className="button text-center"
          onClick={() =>
            navigate("/app/subscriptions", { state: "searchCustomer" })
          }
        >
          {upgrade_subscription}
        </button>
      </Modal.Body>
    </Modal>
  );
};
