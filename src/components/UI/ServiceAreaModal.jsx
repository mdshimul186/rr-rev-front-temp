import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { searchCustomer } from "../../services/customer";
import { CustomerAttomModal } from "./CustomerAttomModal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { RENTAL_ATTOM } from "../../config/constant";

/**
 * ServiceAreaModal component displays a modal for confirming the service area selection.
 * It allows users to either confirm or cancel the selection and handles the submission of the service area data.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.show - State indicating if the modal is visible.
 * @param {Function} props.onCloseModel1 - Function to handle closing the modal.
 * @param {Function} props.onRequestClose - Function to handle additional close actions.
 * @param {Object} props.serviceAreaPayload - Payload containing service area data.
 * @param {Function} props.setSearchCustomerData - Function to update the search customer data.
 * @param {Function} props.setShowReview - Function to update the review visibility state.
 * @param {Function} props.getUser Detail - Function to fetch user details.
 * @param {Function} props.setSameAddressSearch - Function to update the same address search state.
 * @returns {JSX.Element} The rendered service area modal.
 */
export const ServiceAreaModal = ({
  show,
  onCloseModel1,
  onRequestClose,
  serviceAreaPayload,
  setSearchCustomerData,
  setShowReview,
  getUserDetail,
  setSameAddressSearch,
}) => {
  const [showCustomerAttomModal, setShowCustomerAttomModal] = useState(false);
  const [customerAttomData, setCustomerAttomData] = useState();
  const { t } = useTranslation();
  const closeModel = () => {
    setShowReview(false);
    setSearchCustomerData([]);
    onCloseModel1();
  };

  useEffect(() => {
    if (show) {
      localStorage.setItem("Service_Range", "Yes");
    }
  }, [show]);

  const handleSubmit = async () => {
    if (!serviceAreaPayload) return;
    let payload = {
      ...serviceAreaPayload,
      with_distance: "No",
    };
    try {
      const response = await searchCustomer(payload);
      if (response.success || response.code === 200) {
        if (response.success && response.message === RENTAL_ATTOM) {
          closeModel();
          setShowCustomerAttomModal(true);
          setCustomerAttomData(serviceAreaPayload);
          return;
        }
        setSearchCustomerData(response.data);
        setSameAddressSearch(response?.addressData);
        onRequestClose();
        setShowReview(true);
        await getUserDetail();
      }
    } catch (error) {
      if (error.response.data.data.message === "Data not found") {
        toast.error(not_found);
        onRequestClose();
      }
    }
  };

  const closeCustomerAttomModal = () => {
    setShowCustomerAttomModal(false);
  };

  const { not_found } = t("verification");
  return (
    <>
      <Modal
        show={show}
        onHide={onRequestClose}
        animation={true}
        centered
        className="delete_customer_modal"
      >
        <Modal.Body className="text-center modal-box">
          <p className="modal-head">{t("customerSearch.address_service")}</p>
          <div className="modal-btns">
            <Button
              variant="secondary"
              className="button close-btn"
              onClick={closeModel}
            >
              {t("customerComponent.no")}
            </Button>
            <Button variant="danger" className="button" onClick={handleSubmit}>
              {t("customerComponent.yes")}
            </Button>
          </div>
          <div className="text-center guidelines">
            <span className="me-1 astrik-symbol"> *</span>
            <p>{t("customerComponent.selecting_yes")}</p>
          </div>
        </Modal.Body>
      </Modal>
      <CustomerAttomModal
        show={showCustomerAttomModal}
        onRequestClose={closeCustomerAttomModal}
        customerAttomData={customerAttomData}
        setSearchCustomerData={setSearchCustomerData}
        setSameAddressSearch={setSameAddressSearch}
        setShowReview={setShowReview}
      />
    </>
  );
};
