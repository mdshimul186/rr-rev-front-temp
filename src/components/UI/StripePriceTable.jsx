import { useState, useEffect } from "react";
import { MdCheckCircle, MdCheckCircleOutline } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getAllStripePlans,
  upgradeSubscriptionApis,
} from "../../services/subscription";
import { toast } from "react-toastify";
import { CancelSubscriptionModal } from "../../components/UI/CancelSubscriptionModal";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BUSINESS_ACCOUNT,
  LEAVE_REVIEWS,
  UNLIMITED_CUSTOMER,
  CUSTOMER_SEARCHES,
  ONE_USER,
  FOUR_ADDITIONAL,
  SUCCESS,
} from "../../config/constant";
import { planTypeMap } from "../../config/planType.json";

/**
 * PriceTable component displays a pricing table for subscription plans.
 * It allows users to view, select, and upgrade their subscription plans.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.active - Indicates the currently active plan.
 * @param {Function} props.handleActiveLink - Function to handle active link changes.
 * @param {string} props.clicked - State indicating which plan was clicked.
 * @param {Function} props.setClicked - Function to update the clicked state.
 * @param {Function} props.setLoading - Function to set loading state.
 * @param {boolean} props.optionValue - Indicates if an option value is selected.
 * @returns {JSX.Element} The rendered price table component.
 */
export const PriceTable = ({
  active,
  handleActiveLink,
  clicked,
  setClicked,
  setLoading,
  optionValue,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const style1 = {
    backgroundColor:
      clicked === "clicked1" ? "var(--button-hover)" : "var(--primary)",
  };
  const style2 = {
    backgroundColor:
      clicked === "clicked2" ? "var(--button-hover)" : "var(--primary)",
  };
  const style3 = {
    backgroundColor:
      clicked === "clicked3" ? "var(--button-hover)" : "var(--primary)",
  };

  const [userSubscribeplan, setuserSubscribeplan] = useState(null);
  const [subscribeplanId, setsubscribeplanId] = useState(null);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState(false);
  const usersDataFromServer = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const [subscribedPlan, setSubscribedPlan] = useState(null);
  const [allStripePlans, setAllStripePlans] = useState({
    Free: { data: [], active_tab: true, active_type: 0 },
    Business: { data: [], active_tab: true, active_type: 0 },
    Ultimate: { data: [], active_tab: true, active_type: 0 },
  });
  const [activePlanType, setActivePlanType] = useState({
    Free: 0,
    Business: 0,
    Ultimate: 0,
  });
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({});
  const [openUpgradeTab, setOpenUpgradeTab] = useState(false);

  useEffect(() => {
    setLoading(true);
    const { users, status } = usersDataFromServer;
    if (users && status == SUCCESS) {
      setUserData({ ...users });

      if (
        ["ultimate_yearly", "Ultimate", "business_yearly", "Business"].includes(
          users.payDetail.plan_name
        )
      ) {
        setuserSubscribeplan(users.payDetail.plan_name);
        setsubscribeplanId(users.payDetail.subscription_id);
        setSubscribeUserPlane(allStripePlans, users.payDetail.plan_name);
      } else {
        setSubscribedPlan(null);
        setuserSubscribeplan(null);
        setsubscribeplanId(null);
      }

      if (allStripePlans.Business.data.length == 0) {
        getPlans();
      }
    }
  }, [usersDataFromServer]);

  useEffect(() => {
    if (location.state === "upgrade") {
      showSubscriptionTab(1);
    }
  }, [location]);

  const showSubscriptionTab = (current) => {
    switch (current) {
      case 0:
        setStripePlanStatus("Free", true, 0);
        setStripePlanStatus("Business", true, 0);
        setStripePlanStatus("Ultimate", true, 0);
        break;
      case 1:
        setStripePlanStatus("Free", false, 0);
        setStripePlanStatus("Business", true, 0);
        setStripePlanStatus("Ultimate", true, 0);
        break;
      case 2:
        setStripePlanStatus("Free", false, 0);
        setStripePlanStatus("Business", true, 1);
        setStripePlanStatus("Ultimate", true, 0);
        break;
      case 3:
        setStripePlanStatus("Free", false, 0);
        setStripePlanStatus("Business", false, 0);
        setStripePlanStatus("Ultimate", true, 0);
        break;
      case 4:
        setStripePlanStatus("Free", false, 0);
        setStripePlanStatus("Business", false, 0);
        setStripePlanStatus("Ultimate", true, 1);
        break;
      default:
        setStripePlanStatus("Free", false, 0);
        setStripePlanStatus("Business", false, 1);
        setStripePlanStatus("Ultimate", false, 0);

        break;
    }
  };

  const setStripePlanStatus = (plan, tab_status, type_status) => {
    allStripePlans[plan].active_tab = tab_status;
    allStripePlans[plan].active_type = type_status;
    activePlanType[plan] = type_status;
    setActivePlanType({ ...activePlanType });
    setAllStripePlans({ ...allStripePlans });
  };

  const { t } = useOutletContext();

  const getPlans = async () => {
    const stripeData = await getAllStripePlans();
    await setStripePlans(stripeData);
  };

  async function setStripePlans(data) {
    allStripePlans.Free.data = [];
    allStripePlans.Business.data = [];
    allStripePlans.Ultimate.data = [];

    await data.forEach((plan) => {
      if (plan.metadata?.plan_name === "Free") {
        allStripePlans.Free.data.push(plan);
        setAllStripePlans({ ...allStripePlans });
      } else if (
        plan.metadata?.plan_name === "Business" ||
        plan.metadata?.plan_name === "business_yearly"
      ) {
        allStripePlans.Business.data.push(plan);
        setAllStripePlans({ ...allStripePlans });
      } else if (
        plan.metadata?.plan_name === "Ultimate" ||
        plan.metadata?.plan_name === "ultimate_yearly"
      ) {
        allStripePlans.Ultimate.data.push(plan);
        setAllStripePlans({ ...allStripePlans });
      }
    });
    setSubscribeUserPlane(allStripePlans, userSubscribeplan);
  }

  const setSubscribeUserPlane = (stripePlan, userPlanName = null) => {
    if (userPlanName != null) {
      let [plan, type] = userPlanName.split("_");
      setSubscribedPlan({
        ...subscribedPlan,
        data: stripePlan[planTypeMap[plan]]["data"],
        plan_name: planTypeMap[plan],
        plan_type: type ? planTypeMap[type] : 0,
      });
    }
  };

  useEffect(() => {
    if (selectedPlanDetails.pricing) {
      handleActiveLink(
        selectedPlanDetails.pricing,
        selectedPlanDetails.planId,
        selectedPlanDetails.planName,
        selectedPlanDetails.planAmount
      );
    }
  }, [selectedPlanDetails]);

  const planTypeHandler = (e, plan, index, data) => {
    setActivePlanType({ ...activePlanType, [plan]: index });
    setSelectedPlanDetails({
      pricing: `${plan}${index}`,
      planId: data.default_price.id,
      planName: data.metadata.plan_name,
      planAmount:
        data.default_price.unit_amount > 0
          ? data.default_price.unit_amount / 100
          : data.default_price.unit_amount,
    });
  };

  const handleCardClick = (planId, pricing, planName, planAmount) => {
    setSelectedPlanDetails({ pricing, planId, planName, planAmount });
    setClicked(
      `clicked ${pricing.charAt(pricing.length - 1)}`,
      pricing,
      planId,
      planName,
      planAmount
    );
  };

  const translatePlan = (key) => {
    const lang = localStorage.getItem("language");
    if (key === "Free" && lang === "spn") {
      return "Gratis";
    } else if (key === "Business" && lang === "spn") {
      return "Negocio";
    } else if (key === "Ultimate" && lang === "spn") {
      return "Último";
    } else {
      return key;
    }
  };

  const {
    business_account,
    leave_reviews,
    unlimited_customers,
    customer_searches,
    one_user,
    four_additional,
    proceed_upgrade,
    proceed_checkout,
    cancel_subscription,
    upgrade_subscription,
    selected,
    select,
    monthly,
    yearly,
  } = t("subscriptionComponent");

  const planFeaturesInEnglish = {
    business_account: BUSINESS_ACCOUNT,
    leave_reviews: LEAVE_REVIEWS,
    unlimited_customers: UNLIMITED_CUSTOMER,
    customer_searches: CUSTOMER_SEARCHES,
    one_user: ONE_USER,
    four_additional: FOUR_ADDITIONAL,
  };

  const planFeatures = {
    Free: {
      business_account,
      leave_reviews,
      unlimited_customers,
      customer_searches,
      one_user,
    },
    Business: {
      business_account,
      leave_reviews,
      unlimited_customers,
      customer_searches,
      one_user,
    },
    Ultimate: {
      business_account,
      leave_reviews,
      unlimited_customers,
      customer_searches,
      four_additional,
    },
  };

  const openCancelSubscriptionModal = () => {
    setShowCancelSubscriptionModal(true);
  };

  const closeCancelSubscriptionModal = () => {
    setShowCancelSubscriptionModal(false);
    window.location.reload();
  };

  const checkOutPage = () => {
    const planData = {
      price_id: selectedPlanDetails.planId,
      plan_name: selectedPlanDetails.planName,
      plan_amount: selectedPlanDetails.planAmount,
    };
    navigate("/app/checkout", { state: planData });
  };

  const { went_wrong } = t("userCheckout");

  const upgradeNow = async () => {
    const upgradeJson = {
      subscription_id: subscribeplanId,
      priceId: selectedPlanDetails.planId,
      plan_name: selectedPlanDetails.planName,
    };
    const upgradeData = await upgradeSubscriptionApis(upgradeJson);
    if (upgradeData.statusCode === 200) {
      window.location.reload();
    } else {
      toast.error(went_wrong);
    }
  };

  const handleUpgradeBtn = () => {
    const dataMap = {
      Free: 1,
      ultimate_yearly: 5,
      Ultimate: 4,
      business_yearly: 3,
      Business: 2,
    };
    showSubscriptionTab(dataMap[userSubscribeplan]);
    setOpenUpgradeTab(true);
  };

  return (
    <>
      {userData ? (
        <div
          className="pricing-cards stripe-pricing-card d-grid"
          style={{
            "--advanced-label": `"${t("subscriptionComponent.advanced")}"`,
          }}
        >
          <>
            {subscribedPlan && !openUpgradeTab ? (
              <>
                {subscribedPlan?.data?.length > 0 && (
                  <div
                    className={`pricing-active ${
                      subscribedPlan.plan_name === "Business" &&
                      active ===
                        `${subscribedPlan.plan_name}${subscribedPlan.plan_type}`
                        ? "businessPlan"
                        : ""
                    }`}
                  >
                    <p>{translatePlan(subscribedPlan.plan_name)}</p>

                    <div className="pricing-amount">
                      <div
                        className={`btn-group subscribeplancheckbox`}
                        role="group"
                        aria-label="Basic radio toggle button group"
                      >
                        <label
                          className={`btn  active `}
                          htmlFor={`${
                            subscribedPlan.data[subscribedPlan.plan_type]
                              .plan_name
                          }${
                            subscribedPlan.data[subscribedPlan.plan_type]
                              .plan_type
                          }`}
                        >
                          $
                          {subscribedPlan.data[subscribedPlan.plan_type]
                            .default_price.unit_amount > 0
                            ? subscribedPlan.data[subscribedPlan.plan_type]
                                .default_price.unit_amount / 100
                            : subscribedPlan.data[subscribedPlan.plan_type]
                                .default_price.unit_amount}{" "}
                          {subscribedPlan.data[subscribedPlan.plan_type]
                            .default_price.recurring.interval === "month"
                            ? `${monthly}`
                            : `${yearly}`}
                        </label>
                      </div>
                    </div>
                    <ul className="pricing-content">
                      {Object.keys(planFeatures[subscribedPlan.plan_name])?.map(
                        (feature) => {
                          return (
                            <li key={feature}>
                              <MdCheckCircle />
                              <span>
                                {
                                  planFeatures[subscribedPlan.plan_name][
                                    feature
                                  ]
                                }
                              </span>
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <div className="text-center d-flex text-center d-flex justify-content-center">
                      <div className="pricing-btn cancelSubscription_btn">
                        <button
                          className="button text-center cancel-button btn btn-danger"
                          value={subscribeplanId}
                          onClick={openCancelSubscriptionModal}
                        >
                          {cancel_subscription}
                        </button>
                      </div>
                      <div className="pricing-btn cancelSubscription_btn">
                        {userSubscribeplan !== "ultimate_yearly" ? (
                          <button
                            className="button text-center"
                            onClick={() => handleUpgradeBtn()}
                          >
                            {upgrade_subscription}
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {Object.keys(allStripePlans).map((plan, index) => (
                  <>
                    {allStripePlans[plan].active_tab && (
                      <div
                        key={index}
                        className={`${
                          active === `${plan}${[activePlanType[plan]]}`
                            ? "pricing-active"
                            : ""
                        } ${
                          userSubscribeplan === "Business" &&
                          active === `${plan}${[activePlanType[plan]]}`
                            ? "businessPlan"
                            : ""
                        }`}
                        onClick={() =>
                          handleCardClick(
                            allStripePlans[plan]["data"][activePlanType[plan]]
                              .default_price.id,
                            `${plan}${[activePlanType[plan]]}`,
                            allStripePlans[plan]["data"][activePlanType[plan]]
                              .metadata.plan_name,
                            allStripePlans[plan]["data"][activePlanType[plan]]
                              .default_price.unit_amount > 0
                              ? allStripePlans[plan]["data"][
                                  activePlanType[plan]
                                ].default_price.unit_amount / 100
                              : allStripePlans[plan]["data"][
                                  activePlanType[plan]
                                ].default_price.unit_amount
                          )
                        }
                      >
                        <p>{translatePlan(plan)}</p>
                        <div className="pricing-amount">
                          <div
                            className={`btn-group subscribeplancheckbox`}
                            role="group"
                            aria-label="Basic radio toggle button group"
                          >
                            {allStripePlans[plan]["data"].map(
                              (plane_type, type_index) => (
                                <>
                                  {allStripePlans[plan]["active_type"] <=
                                    type_index && (
                                    <>
                                      <input
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          planTypeHandler(
                                            e,
                                            plan,
                                            type_index,
                                            plane_type
                                          );
                                        }}
                                        value={type_index}
                                        type="radio"
                                        checked={
                                          type_index == activePlanType[plan]
                                        }
                                        className={`btn-check`}
                                        name="btnradio"
                                        id={`${plan}${type_index}`}
                                        autoComplete="off"
                                      />
                                      {allStripePlans["Free"].active_tab}
                                      <label
                                        className={`btn  ${
                                          activePlanType[plan] == type_index
                                            ? "active"
                                            : ""
                                        } `}
                                        htmlFor={`${plan}${type_index}`}
                                      >
                                        $
                                        {plane_type.default_price.unit_amount >
                                        0
                                          ? plane_type.default_price
                                              .unit_amount / 100
                                          : plane_type.default_price
                                              .unit_amount}{" "}
                                        {plane_type.default_price.recurring
                                          .interval === "month"
                                          ? `${monthly}`
                                          : `${yearly}`}
                                      </label>
                                    </>
                                  )}
                                </>
                              )
                            )}
                          </div>
                        </div>
                        <ul className="pricing-content">
                          {Object.keys(planFeatures[plan]).map((feature) => (
                            <li
                              key={feature}
                              className={
                                allStripePlans[plan][
                                  "data"
                                ]?.[0]?.marketing_features?.some(
                                  (module) =>
                                    module.name ===
                                    planFeaturesInEnglish[feature]
                                )
                                  ? ""
                                  : "disable-pricing"
                              }
                            >
                              {allStripePlans[plan][
                                "data"
                              ]?.[0]?.marketing_features?.some(
                                (module) =>
                                  module.name === planFeaturesInEnglish[feature]
                              ) ? (
                                <MdCheckCircle />
                              ) : (
                                <MdCheckCircleOutline />
                              )}
                              <span>{planFeatures[plan][feature]}</span>
                            </li>
                          ))}
                        </ul>
                        {userSubscribeplan ? (
                          <div className="pricing-btn cancelSubscription_btn">
                            <button
                              className="button text-center cancel-button btn btn-danger"
                              value={subscribeplanId}
                              onClick={openCancelSubscriptionModal}
                            >
                              {cancel_subscription}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="pricing-btn">
                              <Link
                                className="button d-block text-center"
                                style={
                                  index === 0
                                    ? style1
                                    : index === 1
                                    ? style2
                                    : style3
                                }
                                onClick={() =>
                                  setClicked(`clicked${index + 1}`)
                                }
                              >
                                {`${plan}${[activePlanType[plan]]}` === active
                                  ? `${selected}`
                                  : `${select}`}
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ))}
              </>
            )}

            <CancelSubscriptionModal
              show={showCancelSubscriptionModal}
              onRequestClose={closeCancelSubscriptionModal}
              subscriptionId={subscribeplanId}
            />
          </>
        </div>
      ) : (
        <>Loading...</>
      )}

      {!subscribedPlan && !optionValue && (
        <div className={active !== "Free0" ? "d-block" : "d-none"}>
          <button
            onClick={() => checkOutPage()}
            title="Proceed to Checkout"
            className="button px-3 ms-auto checkout-btn mt-3 m-0"
          >
            {proceed_checkout}
          </button>
        </div>
      )}
      {openUpgradeTab && (
        <div className={active !== "Free0" ? "d-block" : "d-none"}>
          <button
            onClick={() => upgradeNow()}
            title="Proceed to Checkout"
            className="button px-3 ms-auto checkout-btn mt-3 m-0"
          >
            {proceed_upgrade}
          </button>
        </div>
      )}
    </>
  );
};
