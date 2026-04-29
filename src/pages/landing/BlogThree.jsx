import { useOutletContext } from "react-router-dom";

export const BlogThree = () => {
  const t = useOutletContext();
  const { blog_three } = t("footer");
  return (
    <>
      <div className="blog-section">
        <div className="row gy-3 blog_one">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h3>{blog_three}</h3>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <p>{t("effectivelyManageCustomer.managing_customer_reviews")}</p>
            <p>
              <strong>
                1. {t("effectivelyManageCustomer.review_platforms")}
              </strong>
              {t("effectivelyManageCustomer.respond_promptly")}
            </p>
            <p>
              <strong>
                2. {t("effectivelyManageCustomer.respond_reviews")}
              </strong>
              {t("effectivelyManageCustomer.whether_review")}
            </p>
            <p>
              <strong>
                3. {t("effectivelyManageCustomer.encourage_customers")}
              </strong>
              {t("effectivelyManageCustomer.after_completing")}
            </p>
            <p>
              <strong>
                4. {t("effectivelyManageCustomer.showcase_positive")}
              </strong>
              {t("effectivelyManageCustomer.highlight_positive")}
            </p>
            <p>
              <strong>5. {t("effectivelyManageCustomer.from_feedback")}</strong>
              {t("effectivelyManageCustomer.analyze_recurring")}
            </p>
            <p>
              <strong>
                6. {t("effectivelyManageCustomer.response_template")}
              </strong>
              {t("effectivelyManageCustomer.develop_templates")}
            </p>
            <p>
              <strong>
                7. {t("effectivelyManageCustomer.professionalism")}
              </strong>
              {t("effectivelyManageCustomer.always_remain")}
            </p>
            <p>{t("effectivelyManageCustomer.implementing_strategies")}</p>
          </div>
        </div>
      </div>
    </>
  );
};
