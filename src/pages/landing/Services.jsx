import bannerImage from "../../assets/images/banner-map.png";
import crmIcon from "../../assets/images/crm-icon.svg";
import marketIcon from "../../assets/images/Market.svg";
import financialIcon from "../../assets/images/financial_planning.svg";
import riskIcon from "../../assets/images/risk_management.svg";
import customerIcon from "../../assets/images/customer_testimonial.svg";
import globalIcon from "../../assets/images/Global_Business.svg";
import { useOutletContext } from "react-router-dom";

export const Services = () => {
  const t = useOutletContext();

  return (
    <>
      <title>Service - Resident Review</title>
      <main className="main-container">
        <section className="banner-section about-us-banner">
          <div className="banner position-relative">
            <img src={bannerImage} alt="" />
            <div className="banner-content">
              <div className="banner-text">
                <h1>{t("header.services")}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="business-service-section">
          <div className="container">
            <div className="business-service-content">
              <div className="service-heading d-flex align-items-center flex-column gap-3">
                <h6>{t("home.who_we_are")}</h6>
                <h1 className="custom-heading">
                  {t("home.platform_services")}
                </h1>
              </div>
              <div className="business-service-cards mt-5">
                <div className="row gy-4">
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={crmIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.built_in_crm")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.import_and_keep")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={financialIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.marketing_opportunities")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.market_directly")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={riskIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.risk_management")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.local_business_owners")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={customerIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.customer_reviews")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.platform_empowers")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={marketIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.marketplace_platforms")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.marketplace_platforms_review")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={globalIcon} alt="" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.business_verification")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.business_verification_platform")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
