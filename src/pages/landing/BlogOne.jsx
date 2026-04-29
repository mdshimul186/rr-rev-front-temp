import { useOutletContext } from "react-router-dom";

export const BlogOne = () => {
  const t = useOutletContext();
  const { blog_one } = t("footer");
  const {
    find_good_customers,
    define_your_ideal_customer,
    define_your_ideal_customer_text,
    Leverage_Online_Platforms,
    Leverage_Online_Platforms_text,
    Network_Locally,
    Network_Locally_text,
    Offer_Promotions_Discounts,
    Offer_Promotions_Discounts_text,
    Use_Targeted_Advertising,
    Use_Targeted_Advertising_text,
    Implement_Referral_Program,
    Implement_Referral_Program_text,
    Follow_Up_with_Past_Clients,
    Follow_Up_with_Past_Clients_text,
    employees_strategies,
  } = t("HowToFindQualityCustomers");
  return (
    <>
      <div className="blog-section">
        <div className="row gy-3 blog_one">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h3>{blog_one}</h3>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <p>{find_good_customers}</p>
            <p>
              
              <strong>1. {define_your_ideal_customer}</strong>
              {define_your_ideal_customer_text}
            </p>
            <p>
              
              <strong>2. {Leverage_Online_Platforms}</strong>
              {Leverage_Online_Platforms_text}
            </p>
            <p>
              
              <strong>3. {Network_Locally}</strong>
              {Network_Locally_text}
            </p>
            <p>
              
              <strong>4. {Offer_Promotions_Discounts}</strong>
              {Offer_Promotions_Discounts_text}
            </p>
            <p>
              
              <strong>5. {Use_Targeted_Advertising}</strong>
              {Use_Targeted_Advertising_text}
            </p>
            <p>
              
              <strong>6. {Implement_Referral_Program}</strong>
              {Implement_Referral_Program_text}
            </p>
            <p>
              
              <strong>7. {Follow_Up_with_Past_Clients}</strong>
              {Follow_Up_with_Past_Clients_text}
            </p>
            <p>{employees_strategies}</p>
          </div>
        </div>
      </div>
    </>
  );
};
