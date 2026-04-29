import { useOutletContext } from "react-router-dom";
import { PriceTable } from "../../components/UI/StripePriceTable";
import { useEffect, useState } from "react";
import { getUserDetails } from "../../services/user";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { getUsersData } from "../../slices/userSlice";
import { PayPerClickSubscription } from "./PayPerClickSubscription";
import { SUCCESS } from "../../config/constant";

/**
 * StripeSubscriptions component manages the subscription plans for users,
 * displaying the current plan and allowing users to select new plans.
 * It fetches user details and updates the UI based on the user's subscription status.
 *
 * @returns {JSX.Element} The rendered Stripe subscriptions component.
 */
export const StripeSubscriptions = () => {
  const { collapse, t } = useOutletContext();
  const [active, setActive] = useState("Free0");
  const [clicked, setClicked] = useState("clicked1");
  const [userPlanName, setuserPlanName] = useState(null);
  const [optionValue, setOptionValue] = useState("");
  const [searchesValue, setSearchesValue] = useState();
  const [searches, setSearches] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const usersData = useSelector((state) => state.user);

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setuserPlanName(users.payDetail.plan_name);
      if (users.user.searches) {
        setSearches(users.user.searches);
      } else {
        setSearches(0);
      }
    }
  }, [usersData]);

  const handleActiveLink = (plan) => {
    setActive(plan);
    setOptionValue("");
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    setuserPlanName(userDetailsData.payDetail.plan_name);
    dispatch(getUsersData(userDetailsData));
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  return (
    <section
      className={`dashboard subscriptions pt-3 left-spacing ${
        collapse ? "expand" : ""
      }`}
    >
      {loading === true && (
        <h1 className="global-heading mb-2">
          {t("subscriptionComponent.subscription")}{" "}
        </h1>
      )}
      {userPlanName ? (
        <>
          {userPlanName ? (
            <div></div>
          ) : (
            <div>
              <div className="current-subscription d-flex align-items-center mb-5">
                <div>
                  <p>{t("subscriptionComponent.free")}</p>
                  <span>{t("subscriptionComponent.plan_limits")}</span>
                </div>
                <span className="subscription-price ms-auto">
                  {t("subscriptionComponent.pricing")}
                </span>
              </div>
            </div>
          )}
          {userPlanName === "Free" && loading === true && (
            <div className="rightSearches">
              <p>
                {searches} {t("subscriptionComponent.searches")}
              </p>
            </div>
          )}
          <div className="wrapper pricing-wrapper cstmpricing-wrapper">
            <>
              {loading === false && (
                <div className="spinner-loder">
                  <span>
                    <BeatLoader />
                  </span>
                </div>
              )}
              <PriceTable
                active={optionValue ? !active : active}
                handleActiveLink={handleActiveLink}
                clicked={optionValue ? !clicked : clicked}
                setClicked={setClicked}
                setLoading={setLoading}
                optionValue={optionValue}
              />
              {loading === true && userPlanName === "Free" && (
                <PayPerClickSubscription
                  optionValue={optionValue}
                  setOptionValue={setOptionValue}
                  searchesValue={searchesValue}
                  setSearchesValue={setSearchesValue}
                />
              )}
            </>
          </div>
        </>
      ) : (
        <div className="spinner-loder">
          <span>
            <BeatLoader />
          </span>
        </div>
      )}
    </section>
  );
};
