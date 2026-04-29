import { useOutletContext } from "react-router-dom";
import { TERMSANDCONDITIONS_URL } from "../../config/constant";

export const TermsCondition = () => {
  const t = useOutletContext();
  const {
    resident_review,
    terms_of_service,
    effective_date,
    heading,
    note,
    definitions,
    a,
    b,
    c,
    d,
    e,
    f,
    parties,
    point_a,
    content,
    content2,
    point_b_one,
    point_b_two,
    point_b_three,
    point_b_four,
    point_b_five,
    point_b_six,
    your_content,
    user_content,
    company_content,
    third_prty_content,
    service_Content,
    account,
    account_text,
    changes_of_terms,
    changes_of_terms_text,
    using_the_service,
    eligibility,
    eligibility_text,
    permission,
    permission_text,
    service_availability,
    service_availability_text,
    account_two_text,
    communications_Others,
    communication_text,
    responsibility_Content,
    responsibility_Content_text,
    our_right,
    our_right_text,
    ownership,
    ownership_text,
    third_party,
    third_party_text,
    Other,
    Other_text,
    content_moderation,
    content_moderation_text,
    requirements,
    requirements_text,
    requirements_text_a,
    requirements_text_one,
    requirements_text_two,
    requirements_text_three,
    requirements_text_four,
    requirements_text_five,
    Customer_Reviews,
    Customer_Reviews_text,
    Customer_Reviews_one,
    Customer_Reviews_two,
    Customer_Reviews_three,
    Customer_Reviews_four,
    Customer_Reviews_five,
    Customer_Reviews_six,
    Customer_Reviews_seven,
    Customer_Reviews_eight,
    Customer_Reviews_nine,
    Customer_Reviews_ten,
    Customer_Reviews_eleven,
    Customer_Reviews_twelve,
    Customer_Reviews_x,
    Customer_Reviews_xi,
    Customer_Reviews_xii,
    Customer_Reviews_xiii,
    Customer_Reviews_xiv,
    Customer_Reviews_xv,
    Customer_Reviews_xvi,
    Customer_Reviews_xvii,
    Customer_Reviews_xvv,
    Customer_Reviews_xxv,
    Customer_Reviews_xx,
    Customer_Reviews_xxi,
    Customer_Reviews_xxii,
    additional,
    copy_right,
    copy_right_text,
    additional_term,
    additional_term_text,
    suggestions,
    suggestions_text,
    third_party_content,
    third_party_content_text,
    indeminity,
    indeminity_text,
    disclaimers,
    hightlight,
    conetnt_one,
    conetnt_two,
    conetnt_three,
    conetnt_four,
    conetnt_five,
    conetnt_six,
    excluded_claims_text,
    termination,
    termination_text_one,
    termination_text_two,
    termination_text_three,
    general_terms,
    general_terms_text_one,
    general_terms_text_two,
    general_terms_text_three,
    general_terms_text_four,
    general_terms_text_five,
    general_terms_text_six,
    general_terms_text_seven,
    general_terms_text_eight,
    choice_law_heading,
    choice_law_one,
    choice_law_two,
    choice_law_three,
    choice_law_four,
    choice_law_five,
    choice_law_six,
    choice_law_seven,
    choice_law_eight,
    choice_law_link,
    excluded_claims,
  } = t("termsConditions");
  return (
    <>
      <title>Terms And Condition - Resident Review</title>
      <main className="main-container">
        <section className="read-more-section">
          <div className="container">
            <div className="read-more-content">
              <div className="row gy-3 privacyPolicy">
                <div className="col-lg-12">
                  <h5 className="policy-heading">{resident_review}</h5>
                  <h5 className="policy-heading">{terms_of_service}</h5>
                  <h5 className="mb-4 policy-heading">{effective_date}</h5>
                  <p>{heading}</p>
                  <p className="note_text mt-2">{note}</p>
                  <p className="note_text mt-2">{definitions}</p>
                  <p>
                    {a} <span className="note_text">{parties}</span> {point_a}
                  </p>
                  <p>
                    {b}
                    <span className="note_text">
                      {content} {content2}
                    </span>
                    {point_b_one} <strong>{your_content}</strong> {point_b_two}
                    <strong>{user_content}</strong> {point_b_three}
                    <strong>{company_content}</strong> {point_b_four}
                    <strong>{third_prty_content}</strong> {point_b_five}
                    <strong>{service_Content}</strong> {point_b_six}
                  </p>
                  <p>
                    {c} <strong>{account}</strong> {account_text}
                  </p>
                  <p>
                    <strong>{changes_of_terms}</strong> {changes_of_terms_text}
                  </p>
                  <p>
                    <strong>{using_the_service}</strong>
                  </p>
                  <p>
                    {a} <strong>{eligibility}</strong> {eligibility_text}
                  </p>
                  <p>
                    {b} <strong>{permission}</strong>
                    {permission_text}
                  </p>
                  <p>
                    {c} <strong>{service_availability}</strong>
                    {service_availability_text}
                  </p>
                  <p>
                    {d} <strong>{account}</strong> {account_two_text}
                  </p>
                  <p>
                    {e} <strong>{communications_Others}</strong>
                    {communication_text}
                  </p>
                  <p>
                    <strong>4. {content}</strong>
                  </p>
                  <p>
                    {a} <strong>{responsibility_Content}</strong>
                    {responsibility_Content_text}
                  </p>
                  <p>
                    {b} <strong>{our_right}</strong> {our_right_text}
                  </p>
                  <p>
                    {c} <strong>{ownership}</strong> {ownership_text}
                  </p>
                  <p>
                    {d} <strong>{third_party}</strong> {third_party_text}
                  </p>
                  <p>
                    {e} <strong>{Other}</strong> {Other_text}
                  </p>
                  <p>
                    {f} <strong>{content_moderation}</strong>
                    {content_moderation_text}
                  </p>
                  <p>
                    <strong>{requirements}</strong> {requirements_text}
                  </p>
                  <p>
                    {a} {requirements_text_a}
                  </p>
                  <p>{requirements_text_one}</p>
                  <p>{requirements_text_two}</p>
                  <p>{requirements_text_three}</p>
                  <p>{requirements_text_four}</p>
                  <p>{requirements_text_five}</p>
                  <p>
                    <strong>
                      {b}
                      {Customer_Reviews}
                    </strong>
                    {Customer_Reviews_text}
                  </p>
                  <p>
                    {c} {Customer_Reviews_one}
                  </p>
                  <p>
                    {d} {Customer_Reviews_two}
                  </p>
                  <p>
                    {e} {Customer_Reviews_three}
                  </p>
                  <p>{Customer_Reviews_four}</p>
                  <p>{Customer_Reviews_five}</p>
                  <p>{Customer_Reviews_six}</p>
                  <p>{Customer_Reviews_seven}</p>
                  <p>{Customer_Reviews_eight}</p>
                  <p>{Customer_Reviews_nine}</p>
                  <p>{Customer_Reviews_ten}</p>
                  <p>{Customer_Reviews_eleven}</p>
                  <p>{Customer_Reviews_twelve}</p>
                  <p>{Customer_Reviews_x}</p>
                  <p>{Customer_Reviews_xi}</p>
                  <p>{Customer_Reviews_xii}</p>
                  <p>{Customer_Reviews_xiii}</p>
                  <p>{Customer_Reviews_xiv}</p>
                  <p>{Customer_Reviews_xv}</p>
                  <p>{Customer_Reviews_xvi}</p>
                  <p>{Customer_Reviews_xvii}</p>
                  <p>{Customer_Reviews_xvv}</p>
                  <p>{Customer_Reviews_xxv}</p>
                  <p>{Customer_Reviews_xx}</p>
                  <p>{Customer_Reviews_xxi}</p>
                  <p>{Customer_Reviews_xxii}</p>
                  <p>
                    <strong>{additional}</strong>
                  </p>
                  <p>
                    {a} <strong>{copy_right}</strong> {copy_right_text}
                  </p>
                  <p>
                    {b} <strong>{additional_term} </strong>
                    {additional_term_text}
                  </p>
                  <p>
                    <strong>{suggestions}</strong> {suggestions_text}
                  </p>
                  <p>
                    <strong>{third_party_content}</strong>
                    {third_party_content_text}
                  </p>
                  <p>
                    <strong>{indeminity}</strong> {indeminity_text}
                  </p>
                  <p>
                    <strong>{disclaimers}</strong>
                  </p>
                  <p>
                    <strong>{hightlight}</strong>
                  </p>
                  <p>{conetnt_one}</p>
                  <p>{conetnt_two}</p>
                  <p>{conetnt_three}</p>
                  <p>{conetnt_four}</p>
                  <p>{conetnt_five}</p>
                  <p>{conetnt_six}</p>
                  <p>
                    <strong>{choice_law_heading}</strong> <br />
                    {choice_law_one}
                    <a
                      href={TERMSANDCONDITIONS_URL}
                      target="_blank"
                      className="highlight-text"
                    >
                      {choice_law_link}
                    </a>
                    {choice_law_two}
                  </p>
                  <p>{choice_law_three}</p>
                  <p>{choice_law_four}</p>
                  <p>{choice_law_five}</p>
                  <p>
                    <strong>{excluded_claims}</strong>
                    {excluded_claims_text}
                  </p>
                  <p>{choice_law_six}</p>
                  <p>{choice_law_seven}</p>
                  <p>{choice_law_eight}</p>
                  <p>
                    <strong>{termination}</strong>
                  </p>
                  <p>{termination_text_one}</p>
                  <p>{termination_text_two}</p>
                  <p>{termination_text_three}</p>
                  <p>
                    <strong>{general_terms}</strong>
                  </p>
                  <p>{general_terms_text_one}</p>
                  <p>{general_terms_text_two}</p>
                  <p>{general_terms_text_three}</p>
                  <p>{general_terms_text_four}</p>
                  <p>{general_terms_text_five}</p>
                  <p>{general_terms_text_six}</p>
                  <p>{general_terms_text_seven}</p>
                  <p>{general_terms_text_eight}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
