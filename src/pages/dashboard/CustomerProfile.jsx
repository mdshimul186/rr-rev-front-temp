import { useOutletContext, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCustomerDetailsById } from "../../services/customer";
import { ReviewStarRating } from "./reviewStarRating";
import { CustomerModal } from "../../components/UI/CustomerModel";
import { useSelector } from "react-redux";
import { SUCCESS } from "../../config/constant";

/**
 * CustomerProfile component displays detailed information about a specific customer.
 * It allows users to view customer details, including personal information and reviews.
 *
 * @returns {JSX.Element} The rendered customer profile component.
 */
export const CustomerProfile = () => {
  const { collapse, t } = useOutletContext();
  const { id: customer_id } = useParams();

  const [customerDetailsData, setCustomerDetailsData] = useState([]);
  const [business_id, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [editCustomerModel, openEditCustomerModel] = useState(false);
  const usersData = useSelector((state) => state.user);
  const [commentLanguage, setCommentLanguage] = useState("");

  useEffect(() => {
    const languages = localStorage.getItem("language");
    setCommentLanguage(languages);
  }, []);

  const fetchCustomerDetails = async (customer_id) => {
    try {
      const payload = {
        customer_id: customer_id,
        business_id: business_id,
      };
      const response = await getCustomerDetailsById(payload);
      const customerData = response.data[0];
      setCustomerDetailsData(customerData);
    } catch (error) {
      console.error("Error fetching business details:", error);
    }
  };

  const openEditCustomer = () => {
    openEditCustomerModel(true);
  };

  useEffect(() => {
    if (customer_id) {
      fetchCustomerDetails(customer_id);
    }
  }, [customer_id, business_id]);

  useEffect(() => {
    const { users, status } = usersData;
    if (users && status == SUCCESS) {
      setBusinessId(users.business_details[0]?._id);
      setBusinessName(users?.business_details[0]?.business_name);
    }
  }, [usersData]);

  const closeModal = () => {
    fetchCustomerDetails(customer_id);
    openEditCustomerModel(false);
  };

  const {
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_address,
    customer_address_line2,
    customer_profile,
    personal_details,
    review_comment,
  } = t("customerSearch");

  const { mobile_number, city, state, zip_code, owner_type } = t("formField");

  const { review_one, review_two, review_three, review_four, review_five } =
    t("reviewRating");

  const { note, note_provided } = t("customerComponent");

  return (
    <>
      <title>Customer Profile - Resident Review</title>
      <section className={`dashboard left-spacing ${collapse ? "expand" : ""}`}>
        <h1 className="global-heading">{customer_profile}</h1>
        <div className="customer-profile d-flex flex-wrap align-items-center">
          <div className="me-3">
            <h2 className="m-0 mb-1 text-break">
              {customerDetailsData.first_name} {customerDetailsData.last_name}
            </h2>
            <span>
              <ReviewStarRating
                size={17}
                mode={true}
                averageRating={customerDetailsData.averageRating}
              />
            </span>
          </div>

          <div className="verified-cell ms-auto">
            {customerDetailsData.verified_by === "attom" && (
              <p>{t("customerName.homeowner_verified")}</p>
            )}
            {customerDetailsData.verified_by === "business" && (
              <p>{t("customerName.address_verified")}</p>
            )}
            {customerDetailsData.verified_by === "unverified" && (
              <p>{t("customerSearch.unverified")}</p>
            )}
            {customerDetailsData.verified_by === null && (
              <p>{t("customerSearch.unverified")}</p>
            )}
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => openEditCustomer(customer_id)}
            >
              {t("customerComponent.editCustomer")}
            </button>
          </div>
        </div>

        <div className="d-grid gap-4 customer-outer grid-two--cols">
          <div className="dashboard-section customer-details">
            <h3 className="dashboard-section--head">{personal_details}</h3>
            <div className="mt-3">
              <p>
                <span className="customer-info--title">
                  {customer_first_name}
                </span>
                <span>{customerDetailsData?.first_name}</span>
              </p>
              <p>
                <span className="customer-info--title">
                  {customer_last_name}
                </span>
                <span>{customerDetailsData?.last_name}</span>
              </p>
              <p>
                <span className="customer-info--title">{customer_email}</span>
                <span>{customerDetailsData?.customer_email}</span>
              </p>
              <p>
                <span className="customer-info--title">{mobile_number}</span>
                <span>{customerDetailsData?.contact}</span>
              </p>
              <p>
                <span className="customer-info--title">{customer_address}</span>
                <span>{customerDetailsData?.address}</span>
              </p>
              <p>
                <span className="customer-info--title">
                  {customer_address_line2}
                </span>
                <span>{customerDetailsData?.address_line2}</span>
              </p>
              <p>
                <span className="customer-info--title">{city}</span>
                <span>{customerDetailsData?.city}</span>
              </p>
              <p>
                <span className="customer-info--title">{state}</span>
                <span>{customerDetailsData?.state}</span>
              </p>
              <p>
                <span className="customer-info--title">{zip_code}</span>
                <span>{customerDetailsData?.zip}</span>
              </p>
              <p>
                <span className="customer-info--title">{owner_type}</span>
                <span>{customerDetailsData?.owner_type}</span>
              </p>
              <p>
                <span className="customer-info--title">{note}</span>
                <span className="text-break">
                  {customerDetailsData?.notes || note_provided}
                </span>
              </p>
              {customerDetailsData?.business_range === "Yes" && (
                <p>
                  <span className="customer-info--title">
                    {t("business_registration.business_range")}
                  </span>
                  <span>{t("customerName.designated_service")} </span>
                </p>
              )}
            </div>
          </div>

          {customerDetailsData.reviewData &&
          customerDetailsData.reviewData.length > 0 ? (
            customerDetailsData.reviewData
              .filter((item) => item.business_name === businessName)
              .map((data, index) =>
                data.comment ||
                data.review_category_one ||
                data.review_category_two ||
                data.review_category_three ||
                data.review_category_four ||
                data.review_category_five ? (
                  <div
                    className="dashboard-section customer-details"
                    key={index}
                  >
                    <h3 className="dashboard-section--head">
                      {review_comment}
                    </h3>
                    <div className="mt-3">
                      <div className="review-ques">
                        <div>
                          <span>{review_one}</span>
                          <span>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.review_category_one}
                            />
                          </span>
                        </div>
                        <div>
                          <span>{review_two}</span>
                          <span>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.review_category_two}
                            />
                          </span>
                        </div>
                        <div>
                          <span>{review_three}</span>
                          <span>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.review_category_three}
                            />
                          </span>
                        </div>
                        <div>
                          <span>{review_four}</span>
                          <span>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.review_category_four}
                            />
                          </span>
                        </div>
                        <div>
                          <span>{review_five}</span>
                          <span>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.review_category_five}
                            />
                          </span>
                        </div>
                      </div>

                      {commentLanguage === "eng" && <p>{data.comment}</p>}
                      {commentLanguage === "spn" && <p>{data.spn_comment}</p>}
                      {/* <p>{data.comment}</p> */}
                    </div>
                  </div>
                ) : null
              )
          ) : (
            <p>{t("business_registration.no_reviews")}</p>
          )}
        </div>

        <CustomerModal
          show={editCustomerModel}
          onRequestClose={closeModal}
          customerId={customer_id}
          business_id={business_id}
        />
      </section>
    </>
  );
};
