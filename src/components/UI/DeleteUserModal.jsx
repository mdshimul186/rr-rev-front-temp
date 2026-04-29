import { MdClose } from "react-icons/md";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { deleteUserById } from "../../services/additionalUser";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";

/**
 * DeleteUser Modal component displays a modal for confirming the deletion of a user.
 * It shows user details and provides options to confirm or cancel the deletion.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onRequestClose - Function to handle closing the modal.
 * @param {Object} props.userData - Data of the user to be deleted.
 * @returns {JSX.Element} The rendered delete user modal.
 */
export const DeleteUserModal = ({ show, onRequestClose, userData }) => {
  const { t } = useOutletContext();
  const [userDetailsData, setUserDetailsData] = useState([]);

  useEffect(() => {
    setUserDetailsData(userData);
  },[userData]);

  const { deleted_successfully, deleteUserHeading, deleteConfirmation } =
    t("userComponent");

  const deleteUser = async () => {
    try {
      const response = await deleteUserById(userData.userId);
      if (response.statusCode == 200) {
        toast.success(deleted_successfully);
      }
      onRequestClose();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const { cancel, yes } = t("customerComponent");

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
        <p className="modal-head global-heading">{deleteUserHeading}</p>
        <span>
          {deleteConfirmation}{" "}
          <span className="bold-text">{userDetailsData?.email} </span>?
        </span>
        <div className="modal-btns">
          <Button
            variant="secondary"
            className="button close-btn"
            onClick={onRequestClose}
          >
            {cancel}
          </Button>
          <Button variant="danger" className="button" onClick={deleteUser}>
            {yes}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};
