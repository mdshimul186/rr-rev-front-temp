import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * PayPerClickSubscription component allows users to select a subscription plan for pay-per-click searches.
 * It updates the selected plan and the number of searches, and navigates to the checkout page.
 *
 * @param {Object} props - The component props.
 * @param {string} props.optionValue - The currently selected subscription plan value.
 * @param {Function} props.setOptionValue - Function to update the selected subscription plan value.
 * @param {number} props.searchesValue - The number of searches associated with the selected plan.
 * @param {Function} props.setSearchesValue - Function to update the number of searches.
 * @returns {JSX.Element} The rendered pay-per-click subscription component.
 */
export const PayPerClickSubscription = ({
  optionValue,
  setOptionValue,
  searchesValue,
  setSearchesValue,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const value = e.target.value;
    const paySearchValue = e.target.attributes.searchvalue.value;
    setSearchesValue(paySearchValue);
    setOptionValue(value);
  };

  const { search_for } = t("subscriptionComponent");

  const payPerplan = [
    {
      name: `1 ${search_for} $4.99`,
      search: 1,
      value: "4.99",
    },
    {
      name: `5 ${search_for} $19.99`,
      search: 5,
      value: "19.99",
    },
    {
      name: `10 ${search_for} $39.99`,
      search: 10,
      value: "39.99",
    },
    {
      name: `15 ${search_for} $49.99`,
      search: 15,
      value: "49.99",
    },
  ];

  const PayPerCheckOutPage = () => {
    navigate("../user-checkout", {
      state: { price: optionValue, searches: searchesValue },
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="payForSearches global-heading mt-3 m-0">
          {t("subscriptionComponent.pPC")}
        </h2>
        <div className={optionValue ? "" : "d-none"}>
          <button
            onClick={() => PayPerCheckOutPage()}
            title="Proceed to Checkout"
            className="button px-3 ms-auto checkout-btn"
          >
            {t("subscriptionComponent.proceed_checkout")}
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="selectPlan search-card mt-0">
            <div className="searchSelectBox selectplan-card">
              <p className="radio-head p-1">
                {t("subscriptionComponent.select_plan")}
              </p>
              {payPerplan.map((plan) => (
                <div
                  className="owner-type--radio d-flex align-items-center"
                  key={plan.value}
                >
                  <div className="me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="plan_range"
                      id={plan.name}
                      value={plan.value}
                      onChange={handleChange}
                      checked={optionValue === plan.value}
                      data-searchvalue={plan.search}
                    />
                    <label className="form-check-label">{plan.name}</label>
                  </div>
                </div>
              ))}
              <div className="pricing-btn d-flex justify-content-center "></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
