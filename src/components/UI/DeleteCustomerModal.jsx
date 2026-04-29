import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  deleteCustomerById,
  getCustomerDetailsById,
} from "../../services/customer";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";

/**
 * DeleteCustomerModal component provides a modal for confirming customer deletion.
 * It fetches customer details and allows users to confirm or cancel deletion.
 *
 * @param {Object} props - The component props.
 * @param {string} props.customerId - The ID of the customer to be deleted.
 * @param {boolean} props.show - State indicating if the modal should be displayed.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {string} props.business_id - The business ID associated with the customer.
 * @returns {JSX.Element} The rendered delete customer modal.
 */
export const DeleteCustomerModal = ({
  customerId,
  show,
  onRequestClose,
  business_id,
}) => {
  const { t } = useOutletContext();
  const [customerDetailsData, setCustomerDetailsData] = useState([]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(customerId);
    }
  }, [customerId]);

  const fetchCustomerDetails = async (customerId) => {
    try {
      const payload = {
        customer_id: customerId,
      };
      const customerDetailsData = await getCustomerDetailsById(payload);
      const customerData = customerDetailsData.data[0];
      setCustomerDetailsData(customerData);
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  const {
    customer_successfully,
    deleteCustomerHeading,
    deleteConfirmation,
    cancel,
    yes,
  } = t("customerComponent");

  const deleteCustomer = async () => {
    try {
      const response = await deleteCustomerById({
        customer_id: customerId,
        business_id: business_id,
      });
      if (response.data.statusCode === 200) {
        toast.success(customer_successfully);
      }
      onRequestClose();
    } catch (error) {
      console.error("Error deleting customer:", error);
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
        <span className="modal-icon">
          <MdClose />
        </span>
        <p className="modal-head global-heading">{deleteCustomerHeading}</p>
        <span>
          {deleteConfirmation}{" "}
          <span className="bold-text">
            {customerDetailsData.first_name} {customerDetailsData.last_name}
          </span>
          ?
        </span>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={onRequestClose}
          >
            {cancel}
          </Button>
          <Button variant="danger" className="button" onClick={deleteCustomer}>
            {yes}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
