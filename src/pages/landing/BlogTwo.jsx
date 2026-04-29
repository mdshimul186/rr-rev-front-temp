import { useOutletContext } from "react-router-dom";

export const BlogTwo = () => {
  const t = useOutletContext();
  const { blog_two } = t("footer");
  const {
    effective_marketing_heading,
    Build_Professional_Website,
    Build_Professional_Website_text,
    Utilize_SEO_Techniques,
    Utilize_SEO_Techniques_text,
    Engage_on_Social_Media,
    Engage_on_Social_Media_text,
    Implement_Email_Marketing,
    Implement_Email_Marketing_text,
    Leverage_Online_Reviews,
    Leverage_Online_Reviews_text,
    Use_Local_Advertising,
    Use_Local_Advertising_text,
    Partner_Other_Local_Businesses,
    Partner_Other_Local_Businesses_text,
    implementing_marketing_strategies,
  } = t("EffectiveMarketingStrategies");

  return (
    <>
      <div className="blog-section">
        <div className="row gy-3 blog_one">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h3>{blog_two}</h3>
          </div>
          <div className="col-sm-12 col-md-12 col-lg-12">
            <p>{effective_marketing_heading}</p>
            <p>
              <strong>1. {Build_Professional_Website} </strong>{" "}
              {Build_Professional_Website_text}{" "}
            </p>
            <p>
              <strong>2. {Utilize_SEO_Techniques} </strong>
              {Utilize_SEO_Techniques_text}
            </p>
            <p>
              <strong>3. {Engage_on_Social_Media} </strong>
              {Engage_on_Social_Media_text}
            </p>
            <p>
              <strong>4. {Implement_Email_Marketing} </strong>
              {Implement_Email_Marketing_text}
            </p>
            <p>
              <strong>5. {Leverage_Online_Reviews} </strong>
              {Leverage_Online_Reviews_text}
            </p>
            <p>
              <strong>6. {Use_Local_Advertising} </strong>
              {Use_Local_Advertising_text}
            </p>
            <p>
              <strong>7. {Partner_Other_Local_Businesses} </strong>
              {Partner_Other_Local_Businesses_text}
            </p>
            <p>{implementing_marketing_strategies}</p>
          </div>
        </div>
      </div>
    </>
  );
};
