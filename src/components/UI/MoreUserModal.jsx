import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate, useOutletContext } from "react-router-dom";
import { MdAttachMoney } from "react-icons/md";

/**
 * MoreUser Modal component displays a modal for purchasing additional user slots.
 * It allows users to specify the quantity and calculates the total price accordingly.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onRequestClose - Function to handle closing the modal.
 * @param {number} props.totalEmployeeAddded - Total number of employees already added.
 * @returns {JSX.Element} The rendered more user modal.
 */
export const MoreUserModal = ({
  show,
  onRequestClose,
  totalEmployeeAddded,
}) => {
  const { t } = useOutletContext();
  const [number, setNumber] = useState(1);
  const [price, setPrice] = useState(5);
  const navigate = useNavigate();

  const payMore = async () => {
    try {
      navigate("../add-user-checkout", {
        state: { price: price, number: number },
      });
      onRequestClose();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleInputNumber = async (e) => {
    const value = e.target.value;
    if (value >= 1) {
      setNumber(value);
    } else {
      toast.error(quantity_must);
      return;
    }
    const totalPrice = 5 * e.target.value;
    setPrice(totalPrice);
  };

  const handleClose = () => {
    setNumber(1);
    onRequestClose();
  };

  const {
    quantity_must,
    need_more_heading,
    need_more_title,
    cancel,
    Quantity,
    Price,
    Pay,
    users_purchase,
  } = t("userComponent");

  return (
    <Modal
      show={show}
      onHide={handleClose}
      animation={true}
      centered
      className="delete_customer_modal"
    >
      <Modal.Body className="text-center modal-box">
        <span className="modal-icon modal-icon-bg">
          <MdAttachMoney />
        </span>
        <p className="modal-head global-heading">{need_more_heading}</p>
        <span>
          {need_more_title}
          {totalEmployeeAddded}
          {users_purchase}
        </span>
        <div className="d-flex justify-content-between mt-3">
          <div className="quantity-field d-flex align-items-center">
            <label htmlFor="quantity" className="form-label mb-0">
              {Quantity}
            </label>
            <input
              type="number"
              className="form-control bg-white"
              min={1}
              id="quantity"
              value={number}
              placeholder="Enter your customer first name"
              onChange={(e) => handleInputNumber(e)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            {Price} <span>{"$" + 5 * number}</span>
          </div>
        </div>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={handleClose}
          >
            {cancel}
          </Button>
          <Button
            variant="primary"
            className="button btn-primary attomModal"
            onClick={payMore}
          >
            {Pay}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
