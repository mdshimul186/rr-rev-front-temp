import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { StarRating } from "./StarRating";
import { Modal } from "react-bootstrap";
import {
  addCustomerReview,
  getCustomerDetailsById,
} from "../../services/customer";
import { useFormik } from "formik";
import { ReviewValidation } from "../../schema";
import { ReviewModal } from "./ReviewModal";
import { NO, YES } from "../../config/constant";

/**
 * AddReviewModal Component
 *
 * A modal component that allows users to submit a review by rating different categories and providing comments.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Determines whether the modal is open.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {string} props.customerData - Customer ID for the review.
 * @param {string} props.businessData - Business ID associated with the review.
 * @param {Function} props.setSameAddressSearch - Function to update address search state.
 * @param {Function} props.setSearchCustomerData - Function to update search customer data state.
 *
 * @returns {JSX.Element} The rendered AddReviewModal component.
 */
export const AddReviewModal = ({
  isOpen,
  onRequestClose,
  customerData,
  businessData,
  setSameAddressSearch,
  setSearchCustomerData,
}) => {
  const { t } = useOutletContext();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingss, setRatings] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  const validation = ReviewValidation(t("validations"));

  const customer = async () => {
    const customer_id = customerData;
    const payload = {
      customer_id: customer_id,
      business_id: businessData,
      matchData: YES,
    };
    const response = await getCustomerDetailsById(payload);
    if (response.success) {
      setSearchCustomerData(response.data);
      setSameAddressSearch(response?.addressData);
    }
  };

  const formik = useFormik({
    initialValues: {
      business_id: businessData,
      customer_id: customerData,
      ratings: [0, 0, 0, 0, 0],
      comment: "",
      terms: false,
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      try {
        const serviceRange = localStorage.getItem("Service_Range");
        const payload = {
          business_id: businessData,
          customer_id: customerData,
          rating: averageRating,
          review_category_one: values.ratings[0].toString(),
          review_category_two: values.ratings[1].toString(),
          review_category_three: values.ratings[2].toString(),
          review_category_four: values.ratings[3].toString(),
          review_category_five: values.ratings[4].toString(),
          comment: values.comment,
          business_range: serviceRange || NO,
        };

        const response = await addCustomerReview(payload);
        if (response.success) {
          response.flagged === YES ? setShowReviewModal(true) : "";
          resetForm();
          customer();
          onRequestClose();
        }
      } catch (error) {
        const errMsg =
          error.response?.data?.data?.data?.result.join(", ") || went_wrong;
        const toastErr = error.response?.data?.data?.message;
        const combinedErrMsg = `${toastErr}: ${errMsg}`;
        formik.setErrors({ comment: combinedErrMsg });
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onRequestClose();
    setRatings(null);
  };

  useEffect(() => {
    setRatings(formik.values.ratings);
    const countNewReviews = formik.values.ratings.filter(
      (rating) => rating > 0
    ).length;
    setTotalReviews(countNewReviews);
  }, [formik.values.ratings]);

  const handleRatingChange = (rate, index) => {
    const newRatings = [...formik.values.ratings];
    const previousRating = newRatings[index];
    newRatings[index] = rate;

    if (previousRating === 0 && rate > 0) {
      setTotalReviews(totalReviews + 1);
    } else if (previousRating > 0 && rate === 0) {
      setTotalReviews(totalReviews - 1);
    }
    formik.setFieldValue("ratings", newRatings);
    setRatings(newRatings);
  };

  const averageRating = ratingss
    ? isOpen
      ? Math.round(
          (formik.values.ratings.reduce((a, b) => a + b, 0) /
            (totalReviews > 0 ? totalReviews : 1)) *
            10
        ) / 10
      : 0
    : 0;

  const { went_wrong } = t("userCheckout");

  return (
    <>
      <Modal
        show={isOpen}
        onHide={handleClose}
        animation={true}
        className="review_modal"
        size="lg"
        centered
      >
        <Modal.Body>
          <form
            onSubmit={formik.handleSubmit}
            className="modal-body text-center"
          >
            <p className="modal-head mb-0 global-heading">
              {t("reviewRating.heading")}
            </p>
            <StarRating
              size={30}
              mode={true}
              allowFraction={true}
              averageRating={averageRating}
              totalRating={totalReviews}
              halfRating="half"
            />
            <div className="review-ques">
              {[
                "review_one",
                "review_two",
                "review_three",
                "review_four",
                "review_five",
              ].map((key, index) => (
                <div key={index}>
                  <span>{t(`reviewRating.${key}`)}</span>
                  <StarRating
                    size={17}
                    mode={false}
                    handleRating={(rate) => handleRatingChange(rate, index)}
                  />
                </div>
              ))}
            </div>
            {formik.errors.ratings && formik.submitCount > 0 && (
              <div className="error text-start pb-2 mt-0">
                {formik.errors.ratings}
              </div>
            )}
            <textarea
              className="form-control bg-white"
              rows="4"
              placeholder={t("reviewRating.commentPlaceholder")}
              {...formik.getFieldProps("comment")}
            />
            <span className="guidelines">
              <span className="me-1 astrik-symbol"> *</span>
              {t("customerName.legal_protection")}
            </span>
            {formik.errors.comment ? (
              <div className="error commentError">{formik.errors.comment}</div>
            ) : null}
            <div className="d-flex my-3">
              <input
                type="checkbox"
                className="form-check-input mt-1"
                id="customerCheck"
                checked={formik.values.terms}
                onChange={(e) =>
                  formik.setFieldValue("terms", e.target.checked)
                }
              />
              <label
                htmlFor="customerCheck"
                className="form-check-label ms-2 text-start"
              >
                {t("reviewRating.review_check_text")}
              </label>
            </div>
            {formik.touched.terms && formik.errors.terms ? (
              <div className="error termsError">{formik.errors.terms}</div>
            ) : null}
            <div className="modal-btns">
              <button
                type="button"
                className="button close-btn"
                onClick={handleClose}
              >
                {t("reviewRating.cancel")}
              </button>
              <button
                type="submit"
                className="button modal-btn-bg"
                disabled={formik.isSubmitting}
              >
                {t("reviewRating.submit")}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ReviewModal
        show={showReviewModal}
        setShowReviewModal={setShowReviewModal}
      />
    </>
  );
};
