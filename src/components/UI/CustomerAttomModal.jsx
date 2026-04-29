import { Modal, Button } from "react-bootstrap";
import { customerAttom } from "../../services/user";
import { useTranslation } from "react-i18next";

/**
 * CustomerAttomModal component displays a confirmation modal for customer attom data processing.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {Object} props.customerAttomData - The data related to the customer attom process.
 * @param {Function} props.setSearchCustomerData - Function to update customer search data.
 * @param {Function} props.setShowReview - Function to toggle review visibility.
 * @param {Function} props.setSameAddressSearch - Function to update the same address search state.
 * @returns {JSX.Element} The rendered customer attom modal.
 */
export const CustomerAttomModal = ({
  show,
  onRequestClose,
  customerAttomData,
  setSearchCustomerData,
  setShowReview,
  setSameAddressSearch,
}) => {
  const { t } = useTranslation();

  const handleClick = async () => {
    const response = await customerAttom(customerAttomData);
    if (response.success) {
      const customerData = response.data;
      setSearchCustomerData(customerData);
      setSameAddressSearch(response?.addressData);
      setShowReview(true);
    }
    onRequestClose();
  };

  const closeModal = () => {
    setSearchCustomerData([]);
    setShowReview(false);
    onRequestClose();
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
        <p className="modal-head">{t("home.add_review")}</p>
        <span> {t("customerSearch.business_renter")}</span>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={closeModal}
          >
            No
          </Button>
          <Button
            variant="primary"
            className="button btn-primary attomModal"
            onClick={handleClick}
          >
            {t("customerComponent.yes")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
