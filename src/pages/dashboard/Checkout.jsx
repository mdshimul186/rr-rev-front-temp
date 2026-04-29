import { useEffect, useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineReply,
} from "react-icons/md";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import { PaymentSuccessModal } from "../../components/UI/PaymentSuccessModal";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { getPromoData } from "../../services/subscription";
import { addSubscription } from "../../services/subscription";
import { useFormik } from "formik";
import { getAllStates } from "../../services/user";
import { toast } from "react-toastify";
import { checkOutSchema } from "../../schema";

/**
 * Checkout component handles the checkout process for subscription plans.
 * It collects payment information, applies promo codes, and processes the payment through Stripe.
 *
 * @returns {JSX.Element} The rendered checkout form for subscriptions.
 */

export const Checkout = () => {
  const { collapse, t } = useOutletContext();
  const [promo, setPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [couponmessage, setcouponmessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};
  const [planCheckOuntPrice, setplanCheckOuntPrice] = useState(
    planData.plan_amount
  );
  const [allStates, setAllStates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [isDisabled, setIsDisabled] = useState(false);
  const [stripeIsLoading, setStripeIsLoading] = useState(false);

  const getPromoDetail = async () => {
    try {
      const promoDetail = await getPromoData({ couponId: promoCode });
      if (!promoDetail.data.data.valid) {
        setPromoCode("");
        setplanCheckOuntPrice(planData.plan_amount);
        setcouponmessage("");
        toast.error(code_expired);
      } else {
        if (promoDetail.data.data.percent_off) {
          await appliedCodePercent(promoDetail.data.data.percent_off);
        }
        setcouponmessage(applied);
        toast.success(applied_successfully);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setplanCheckOuntPrice(planData.plan_amount);
      setcouponmessage("");
      setPromoCode("");
      toast.error(not_found);
    }
  };

  const handleChangeCode = (event) => {
    setPromoCode(event.target.value);
  };

  const appliedCodePercent = async (offNumber) => {
    const actualAmount = parseFloat(planData.plan_amount);
    const offNumberFloat = parseFloat(offNumber);
    let updatedPrice = actualAmount - (actualAmount * offNumberFloat) / 100;
    let roundUpdatedPrice = updatedPrice.toFixed(2);
    setplanCheckOuntPrice(roundUpdatedPrice);
  };

  const stripeHandle = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(
      CardNumberElement,
      CardExpiryElement,
      CardCvcElement
    );
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      const errorMessages = {
        incomplete_number: provide_valid,
        invalid_number: provide_valid,
        incomplete_expiry: valid_expiry,
        incomplete_cvc: valid_cvv,
      };

      const errorMessage = errorMessages[error.code];
      if (errorMessage) {
        toast.error(errorMessage);
      }
      setStripeIsLoading(false);
      return;
    }
    return paymentMethod;
  };

  const validation = checkOutSchema(t("validations"));

  const formik = useFormik({
    initialValues: {
      cardholder_name: "",
      billing_address: "",
      billing_address_line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    validationSchema: validation,

    onSubmit: async (values, { resetForm }) => {
      try {
        setStripeIsLoading(true);
        setIsDisabled(true);
        const stripeDataId = await stripeHandle();
        if (!stripeDataId) {
          setStripeIsLoading(false);
          setIsDisabled(false);
          return;
        }
        if (!stripeDataId.id) {
          toast.error(went_wrong);
          setIsDisabled(false);
          setStripeIsLoading(false);
          return;
        }
        const paymethodId = stripeDataId.id;
        const updatedCardInfo = {
          ...values,
          paymethodId: paymethodId,
          priceId: planData.price_id,
          plan_name: planData.plan_name,
          paid_amt: planCheckOuntPrice,
          couponId: promoCode,
        };
        const response = await addSubscription(updatedCardInfo);

        if (response.data.message) {
          setStripeIsLoading(false);
          setIsModalOpen(true);

          resetForm();
          if (response.data.data.id) {
            console.log(response.data.message);
          } else {
            setIsDisabled(false);
            toast.error(went_wrong);
          }
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setStripeIsLoading(false);
        toast.error(went_wrong);
        setIsDisabled(false);
      }
    },
  });

  const getStates = async () => {
    const statesData = await getAllStates();
    setAllStates(statesData);
  };

  useEffect(() => {
    getStates();
  }, []);

  const handleClose = () => {
    navigate("/app/dashboard");
  };

  const { Pay } = t("userComponent");
  const {
    pending_loader,
    valid_cvv,
    code_expired,
    not_found,
    applied_successfully,
    applied,
    provide_valid,
    valid_expiry,
    went_wrong,
    ultimate_yearly,
    business_yearly,
    ultimate_monthly,
    business_monthly,
  } = t("userCheckout");

  const plansSubsName = {
    ultimate_yearly: ultimate_yearly,

    business_yearly: business_yearly,

    Ultimate: ultimate_monthly,

    Business: business_monthly,
  };

  return (
    <>
      <section
        className={`dashboard checkout left-spacing ${
          collapse ? "expand" : ""
        }`}
      >
        <h1 className="global-heading">{t("userCheckout.checkout")}</h1>
        <>
          <form onSubmit={formik.handleSubmit}>
            <div className="d-grid gap-4 checkout-section">
              <div className="dashboard-section ">
                <h3 className="dashboard-section--head">
                  {t("userCheckout.card_details")}{" "}
                </h3>
                <div className="row row-gap-4 mt-4">
                  <div className="col-12">
                    <label htmlFor="cardHolderName" className="form-label">
                      {t("userCheckout.card_holder")}
                    </label>
                    <input
                      type="text"
                      maxLength="30"
                      name="cardholder_name"
                      className="form-control"
                      id="cardholder_name"
                      value={formik.values.cardholder_name}
                      onChange={(e) => {
                        const value = e.target.value.trimStart();
                        formik.setFieldValue("cardholder_name", value);
                      }}
                      onBlur={formik.handleBlur}
                      placeholder={t("userCheckout.card_holder")}
                    />
                    {formik.touched.cardholder_name &&
                      formik.errors.cardholder_name && (
                        <div className="error">
                          {formik.errors.cardholder_name}
                        </div>
                      )}
                  </div>
                  <div className="col-12">
                    <label htmlFor="cardNo" className="form-label">
                      {t("userCheckout.card_number")}
                    </label>
                    <CardNumberElement className="form-control" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="expiryDate" className="form-label">
                      {t("userCheckout.expiry_date")}
                    </label>
                    <CardExpiryElement className="form-control" />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="cvv" className="form-label">
                      {t("userCheckout.cvv")}
                    </label>
                    <CardCvcElement className="form-control" />
                  </div>
                </div>
                <div className="billing-detail mt-2">
                  <div>
                    <div>
                      <p>{t("userCheckout.selected_subscription")}</p>
                      {plansSubsName[planData.plan_name]}
                    </div>
                    <span className="ms-auto small-price">
                      ${planCheckOuntPrice}
                    </span>
                  </div>
                  <div>
                    <p>{t("userCheckout.total")}</p>
                    <span className="ms-auto large-price">
                      ${planCheckOuntPrice}
                    </span>
                  </div>
                  <div className="p-0 flex-column">
                    <span
                      className="promo-link"
                      onClick={() => setPromo(!promo)}
                    >
                      {t("userCheckout.promo_code")}
                      {promo ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </span>
                    <div
                      className={`input-group mt-3 ${promo ? "" : "d-none"}`}
                    >
                      <input
                        type="text"
                        id="promoCode"
                        name="promoCode"
                        onChange={handleChangeCode}
                        maxLength="25"
                        value={promoCode}
                        className="form-control bg-white promoCode"
                        placeholder={t("userCheckout.promo")}
                        aria-label="Promo Code"
                      />
                      <span
                        className="input-group-text px-sm-5 px-4"
                        onClick={getPromoDetail}
                      >
                        {t("userCheckout.apply")}
                      </span>
                    </div>
                    <div className="couponmessage ">
                      {couponmessage ? (
                        <span className="appliedCoupon">
                          {t("userCheckout.applied")}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dashboard-section">
                <h3 className="dashboard-section--head">
                  {t("userCheckout.billing_address")}
                </h3>
                <div className="row row-gap-4 mt-4">
                  <div className="col-sm-6">
                    <label htmlFor="billingAddress" className="form-label">
                      {t("userCheckout.billing_address")}
                    </label>
                    <input
                      type="text"
                      name="billing_address"
                      maxLength="50"
                      className="form-control"
                      id="billingAddress"
                      placeholder={t("userCheckout.your_billing")}
                      value={formik.values.billing_address}
                      onChange={(e) => {
                        const value = e.target.value.trimStart();
                        formik.setFieldValue("billing_address", value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.billing_address &&
                      formik.errors.billing_address && (
                        <div className="error">
                          {formik.errors.billing_address}
                        </div>
                      )}
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="billingAddressLine2" className="form-label">
                      {t("userCheckout.address_line")}
                    </label>
                    <input
                      type="text"
                      name="billing_address_line2"
                      className="form-control"
                      id="billingAddressLine2"
                      maxLength="50"
                      placeholder={t("userCheckout.your_street")}
                      value={formik.values.billing_address_line2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="billingCity" className="form-label">
                      {t("formField.city")}
                    </label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      id="billingCity"
                      maxLength="30"
                      placeholder={t("formField.enter_city")}
                      value={formik.values.city}
                      onChange={(e) => {
                        const value = e.target.value.trimStart();
                        formik.setFieldValue("city", value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="error">{formik.errors.city}</div>
                    )}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">{t("formField.state")}</label>
                    <select
                      className="form-select"
                      aria-label="Select State"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option>{t("formField.select_state")}</option>
                      {allStates.map((state) => (
                        <option key={state.Name} value={state.Name}>
                          {state.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="billingZipCode" className="form-label">
                      {t("formField.zip_code")}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="zip"
                      id="billingZipCode"
                      placeholder={t("formField.enter_zip_code")}
                      value={formik.values.zip}
                      onChange={(e) => {
                        const value = e.target.value.trimStart();
                        formik.setFieldValue("zip", value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.zip && formik.errors.zip ? (
                      <div className="error">{formik.errors.zip}</div>
                    ) : null}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">
                      {t("formField.country")}
                    </label>

                    <select
                      className="form-select"
                      aria-label="Select Country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option key="United States" value="United States">
                        United States
                      </option>
                    </select>
                  </div>
                </div>
                <div className="business-btns billing-btns gap-3">
                  <button
                    type="submit"
                    disabled={isDisabled}
                    title="Pay"
                    className="button w-100"
                  >
                    {stripeIsLoading
                      ? pending_loader
                      : `${Pay} ${planCheckOuntPrice}`}
                  </button>
                  <button
                    type="button"
                    className="button d-flex justify-content-center gap-1 w-100"
                    title="Go Back"
                    onClick={() => navigate(-1)}
                  >
                    <MdOutlineReply className="position-static" />
                    <span>{t("userCheckout.go_back")}</span>
                  </button>
                </div>
              </div>
            </div>
            <PaymentSuccessModal show={isModalOpen} onHide={handleClose} />
          </form>
        </>
      </section>
    </>
  );
};
