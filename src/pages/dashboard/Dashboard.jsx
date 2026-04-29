import { useOutletContext, useNavigate } from "react-router-dom";
import logo2 from "../../assets/images/logo2.png";
import { AddReviewModal } from "../../components/UI/AddReviewModal";
import { useState, useEffect, useMemo } from "react";
import { getAllStates, getUserDetails } from "../../services/user";
import {
  searchCustomer,
  getBusinessDetails,
  getCustomerDetailsById,
  getMarketingBanner,
  bannerLogger,
} from "../../services/customer";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { searchCustomerSchema } from "../../schema";
import { ReviewStarRating } from "./reviewStarRating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SearchCustomerModel } from "../../components/UI/SearchCustomerModel";
import { CustomerAttomModal } from "../../components/UI/CustomerAttomModal";
import { BeatLoader } from "react-spinners";
import { ServiceAreaModal } from "../../components/UI/ServiceAreaModal";
import { IMG_API_BASE_URL } from "../../config/config";
import { RENTAL_ATTOM, YES } from "../../config/constant";

/**
 * Dashboard component serves as the main interface for users to manage customer data,
 * view business details, and perform various actions related to customer reviews and searches.
 *
 * @returns {JSX.Element} The rendered dashboard component.
 */

export const Dashboard = () => {
  const navigate = useNavigate();
  const { collapse, t } = useOutletContext();
  const [showReview, setShowReview] = useState(false);
  const [allStates, setAllStates] = useState([]);
  const [businessDetails, setBusinessDetails] = useState([]);
  const [searchCustomerData, setSearchCustomerData] = useState([]);
  const [sameAddressSearch, setSameAddressSearch] = useState([]);
  const [business_id, setBusinessId] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [sortOrder] = useState("asc"); // State for sorting order
  const [showMoreUserModal, setShowMoreUserModal] = useState(false);
  const [showCustomerAttomModal, setShowCustomerAttomModal] = useState(false);
  const [customerAttomData, setCustomerAttomData] = useState();
  const [businessName, setBusinessName] = useState(false);
  const [userId, setUserId] = useState("");
  const [userPlanName, setuserPlanName] = useState(null);
  const [searches, setSearches] = useState(0);
  const [language, setLanguage] = useState("");
  const [serviceArea, setServiceArea] = useState(false);
  const [serviceAreaPayload, setServiceAreaPayload] = useState(false);
  const [commentLanguage, setCommentLanguage] = useState("");
  const [partnerBannerDetails, setPartnerBannerDetails] = useState([]);
  const [marketingLoder, setMarketingLoder] = useState(false);

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  useEffect(() => {
    const languages = localStorage.getItem("language");
    setCommentLanguage(languages);
    if (languages === "eng") {
      setLanguage("en-US");
    } else if (languages === "spn") {
      setLanguage("es-MX");
    }
  }, [language]);

  const validation = searchCustomerSchema(t("validations"));
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    },
    validationSchema: validation,

    onSubmit: async (values) => {
      try {
        const searchCustomerInfo = {
          ...values,
          city: values.city.trim(),
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          address: values.address.trim(),
          page: 1,
          pageSize: 10,
          business_id: business_id,
        };

        searchCustomerByData(searchCustomerInfo);
      } catch (error) {
        if (error.response) {
          toast.error(error_processing);
        }
      }
    },
  });

  const searchCustomerByData = async (payload) => {
    try {
      const response = await searchCustomer(payload);
      localStorage.removeItem("Service_Range");
      if (response.success && response.message === RENTAL_ATTOM) {
        setShowCustomerAttomModal(true);
        setCustomerAttomData(payload);
        getUserDetail();
        return;
      }
      if (response?.searchData?.valid == false) {
        setSearchCustomerData(response.data);
        setSameAddressSearch(response?.addressData);
        setShowReview(true);
      }

      if (response.success) {
        const searchCustomers = response.data;
        getUserDetail();
        setSearchCustomerData(searchCustomers);
        setSameAddressSearch(response?.addressData);

        setShowReview(true);
      }
    } catch (error) {
      if (error.response?.data?.data?.data?.valid == false) {
        setServiceAreaPayload(payload);
        setServiceArea(true);
      } else if (error.response.data?.data?.message === "Data not found") {
        toast.error(not_found);
      } else {
        toast.error(error.response.data.data.message);
      }
    }
  };

  const getStates = async () => {
    const statesData = await getAllStates();
    setAllStates(statesData);
  };

  const fetchBusinessDetails = async () => {
    try {
      const businessDetailsData = await getBusinessDetails(business_id);
      setBusinessDetails(businessDetailsData.data);
    } catch (error) {
      setBusinessDetails("");
      if (error.response) {
        toast.error(went_wrong);
      }
    }
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    setBusinessId(userDetailsData.business_details[0]?._id);
    setuserPlanName(userDetailsData.payDetail.plan_name);
    setBusinessName(userDetailsData.business_details[0]?.business_name);
    setUserId(userDetailsData.user._id);

    if (userDetailsData.user.searches) {
      setSearches(userDetailsData.user.searches);
    } else {
      setSearches(0);
    }
  };

  useEffect(() => {
    getStates();
    getUserDetail();
  }, []);

  useEffect(() => {
    if (business_id) {
      fetchBusinessDetails();
    }
  }, [business_id, searchCustomerData]);

  const openModal = () => {
    setModalOpen(true);
  };

  const customer = async () => {
    const customer_id = searchCustomerData[0]?._id;
    const payload = {
      customer_id: customer_id,
      business_id: business_id,
      matchData: YES,
    };
    const response = await getCustomerDetailsById(payload);
    if (response.success) {
      setSearchCustomerData(response.data);
      setSameAddressSearch(response?.addressData);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1)
      return `${interval} ${year}${interval > 1 ? "s" : ""} ${ago}`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1)
      return `${interval} ${month}${interval > 1 ? "s" : ""} ${ago}`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1)
      return `${interval} ${day}${interval > 1 ? "s" : ""} ${ago}`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1)
      return `${interval} ${hour}${interval > 1 ? "s" : ""} ${ago}`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1)
      return `${interval} ${minute}${interval > 1 ? "s" : ""} ${ago}`;
    return just_now;
  };

  const sortedReviews = searchCustomerData[0]?.reviewData
    ? [...(searchCustomerData[0]?.reviewData || [])].sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      })
    : "";

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="dashboardUl">{dots}</ul>
      </div>
    ),

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const closeMoreUserModal = () => {
    setShowMoreUserModal(false);
  };

  const closeCustomerAttomModal = () => {
    setShowCustomerAttomModal(false);
  };

  const CloseServiceAreaModal = () => {
    setServiceArea(false);
  };

  const CloseServiceAreaModal1 = () => {
    setServiceArea(false);
  };

  const resetMap = () => {
    setSearchCustomerData([]);
    setShowReview(false);
    formik.resetForm();
  };

  useEffect(() => {
    const getBanner = async () => {
      try {
        const response = await getMarketingBanner();
        if (response) {
          setPartnerBannerDetails(response.partnerBannerDeatils);
        }
      } catch (error) {
        console.error("Error fetching marketing banner:", error);
      }
    };
    getBanner();
  }, []);

  const handlePartnerClick = async (banner_id, partnerID) => {
    const payload = {
      business_id: business_id,
      banner_id: banner_id,
      partner_id: partnerID,
      user_id: userId,
    };
    await bannerLogger(payload);
  };

  const mapUserData = useMemo(() => {
    setMarketingLoder(false);
    if (businessDetails._id) {
      const address = `${businessDetails?.business_address || ""} ${
        businessDetails?.address_line2 || ""
      } ${businessDetails?.city || ""} ${businessDetails?.state || ""} ${
        businessDetails?.zip || ""
      }`.trim();
      const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(
        address
      )}&language=${language}&maptype=satellite`;
      return (
        <iframe
          src={mapSrc}
          width="667"
          height="517"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0 flex-grow-1 CstmMapWrapper"
        ></iframe>
      );
    } else {
      setMarketingLoder(true);
      return (
        <div className="spinner-loder">
          <span>
            <BeatLoader />
          </span>
        </div>
      );
    }
  }, [businessDetails]);

  const { city, state, zip_code } = t("formField");
  const { went_wrong } = t("userCheckout");

  const {
    error_processing,
    searching_reviews,
    customer_first_name,
    customer_last_name,
    enter_customer_first_name,
    enter_customer_last_name,
    customer_address,
    enter_customer_address,
    enter_customer_city,
    select_customer_state,
    enter_customer_zipcode,
    search,
    business_profile_not_found,
    search_customer,
    total_reviews,
    ratings,
  } = t("customerSearch");
  const { year, ago, month, day, hour, minute, just_now, addReview } =
    t("customerComponent");

  const { not_found } = t("verification");

  return (
    <>
      <section
        className={`pt-3 dashboard left-spacing ${collapse ? "expand" : ""}`}
      >
        {!businessDetails && (
          <h2 className="text-center">{business_profile_not_found}</h2>
        )}
        <div className="search-customers ">
          <h2 className="m-0 mb-2 global-heading">{search_customer}</h2>

          {userPlanName === "Free" ? (
            <div className="dashboardSearches">
              <p>
                {searches} {t("subscriptionComponent.searches")}
              </p>
            </div>
          ) : (
            ""
          )}
          <form
            onSubmit={formik.handleSubmit}
            className="d-grid grid-seven--cols dashboard-section p-3 align-items-end"
          >
            <div className="dashboard-inputfield">
              <label htmlFor="firstName" className="form-label">
                {customer_first_name}
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={enter_customer_first_name}
                className="form-control clearNo"
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <div className="error">{formik.errors.first_name}</div>
              ) : null}
            </div>
            <div className="dashboard-inputfield">
              <label htmlFor="lastName" className="form-label">
                {customer_last_name}
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={enter_customer_last_name}
                className="form-control clearNo"
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <div className="error">{formik.errors.last_name}</div>
              ) : null}
            </div>
            <div className="dashboard-inputfield">
              <label htmlFor="address" className="form-label">
                {customer_address}
              </label>
              <input
                type="text"
                className="form-control clearNo"
                id="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={enter_customer_address}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="error">{formik.errors.address}</div>
              ) : null}
            </div>
            <div className="dashboard-inputfield">
              <label htmlFor="city" className="form-label">
                {city}
              </label>
              <input
                type="text"
                className="form-control clearNo"
                id="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={enter_customer_city}
              />
              {formik.touched.city && formik.errors.city ? (
                <div className="error">{formik.errors.city}</div>
              ) : null}
            </div>
            <div className="dashboard-inputfield">
              <label className="form-label">{state}</label>
              <select
                className="form-select"
                aria-label="Select your customer state"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option>{select_customer_state}</option>
                {allStates.map((state) => (
                  <option key={state.Name} value={state.Name}>
                    {state.Name}
                  </option>
                ))}
              </select>
              {formik.touched.state && formik.errors.state ? (
                <div className="error">{formik.errors.state}</div>
              ) : null}
            </div>
            <div className="dashboard-inputfield">
              <label htmlFor="zipCode" className="form-label">
                {zip_code}
              </label>
              <input
                type="number"
                className="form-control"
                id="zip"
                value={formik.values.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={enter_customer_zipcode}
              />
              {formik.touched.zip && formik.errors.zip ? (
                <div className="error">{formik.errors.zip}</div>
              ) : null}
            </div>
            <div className="d-flex gap-4 dashboard-inputfield">
              <button type="submit" title="Search" className="button ">
                {search}
              </button>
              <button
                type="reset"
                onClick={() => resetMap()}
                title="Reset"
                className="button Cstm-ResetBtn"
              >
                {t("customerSearch.reset")}
              </button>
              {/* Directly  Add Review */}
              {/* <button
                type="addReview"
                onClick={() => directAddReview()}
                title="addReview"
                className="button Cstm-ResetBtn"
              >
                {t("reviewRating.heading")}
              </button> */}
            </div>
          </form>
        </div>

        <div className="customer-map">
          {searchCustomerData && searchCustomerData?.length > 0 ? (
            <div className="customerMap">
              {searchCustomerData?.map((data, index) => {
                const fromAddress = `${
                  businessDetails?.business_address || ""
                } ${businessDetails?.city || ""} ${businessDetails?.zip || ""}`;
                const toAddress = `${data?.address || ""} ${data?.city || ""} ${
                  data?.state || ""
                } ${data?.zip || ""}`;

                const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_API_KEY}&origin=${encodeURIComponent(
                  fromAddress
                )}&destination=${encodeURIComponent(
                  toAddress
                )}&language=${language}&maptype=satellite`;
                return (
                  <iframe
                    key={index}
                    src={mapSrc}
                    width="667"
                    height="517"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0 flex-grow-1 customerMap"
                  ></iframe>
                );
              })}
            </div>
          ) : (
            mapUserData
          )}
          {/* for free searches for modified condition */}

          <div
            className={`customer-review ${showReview ? "d-block" : "d-none"}`}
          >
            <div
              className={`customer-review ${showReview ? "d-block" : "d-none"}`}
            >
              {searchCustomerData.map((data) => {
                const ratingCounts = Array(5).fill(0);
                const ratingSums = Array(5).fill(0);
                data.reviewData.forEach((review) => {
                  const rating = parseInt(review.rating, 10);
                  if (rating >= 1 && rating <= 5) {
                    ratingCounts[rating - 1]++;
                    ratingSums[rating - 1] += rating;
                  }
                });
                return (
                  <>
                    <div className="position-sticky top-0 z-3 bg-white d-flex flex-wrap align-items-center justify-content-center customer-review--head">
                      <div className="filter-review"></div>
                      <button
                        type="button"
                        title="Add Review"
                        className="button add-review-btn"
                        onClick={openModal}
                      >
                        <span>
                          <img
                            src={logo2}
                            alt="Dell"
                            width={20}
                            height={11.2}
                            className="img-fluid"
                          />
                        </span>
                        {addReview}
                      </button>
                    </div>

                    <div className="d-flex flex-wrap align-items-center justify-content-between customer-rating--outer">
                      <div className="customer-rating">
                        <p>{total_reviews}</p>
                        <div>
                          <p>{data.averageRating > 0 ? data.reviewCount : 0}</p>
                        </div>
                      </div>
                      {(searches > 0 ||
                        userPlanName === "Business" ||
                        userPlanName === "business_yearly" ||
                        userPlanName === "Ultimate" ||
                        userPlanName === "ultimate_yearly") && (
                        <div className="customer-rating">
                          <p>{ratings}</p>
                          <div className="d-flex align-items-center gap-2">
                            <p>{data.averageRating}</p>
                            <ReviewStarRating
                              size={17}
                              mode={true}
                              averageRating={data.averageRating}
                            />
                          </div>
                        </div>
                      )}
                      <div className="d-flex flex-column gap-1"></div>
                    </div>
                    {!data.averageRating > 0 && (
                      <div className="text-center first-review">
                        <span>{t("customerSearch.first_company")} </span>
                      </div>
                    )}
                    {searches > 0 ||
                    userPlanName === "Business" ||
                    userPlanName === "business_yearly" ||
                    userPlanName === "Ultimate" ||
                    userPlanName === "ultimate_yearly" ? (
                      <></>
                    ) : (
                      <div className="text-center p-2">
                        <div>
                          <span> {searching_reviews}</span>
                        </div>
                        <button
                          className="button text-center"
                          onClick={() =>
                            navigate("/app/subscriptions", { state: "upgrade" })
                          }
                        >
                          {t("subscriptionComponent.upgrade_subscription")}
                        </button>
                      </div>
                    )}

                    {searches > 0 ||
                    userPlanName === "Business" ||
                    userPlanName === "business_yearly" ||
                    userPlanName === "Ultimate" ||
                    userPlanName === "ultimate_yearly" ? (
                      <>
                        <div className="review-body d-grid grid-two--cols cardBottom">
                          {sortedReviews.length > 0 && (
                            <>
                              {sortedReviews.map((review) => {
                                return (
                                  <div
                                    className="business-review"
                                    key={review._id}
                                  >
                                    {review.rating && (
                                      <div>
                                        {review.company_logo && (
                                          <img
                                            src={`${IMG_API_BASE_URL}${review.company_logo}`}
                                            width={30}
                                            height={30}
                                            className="img-fluid"
                                          />
                                        )}
                                        <div>
                                          <p className="business-review--name text-break">
                                            {review.business_name}
                                          </p>
                                          <ReviewStarRating
                                            size={17}
                                            mode={true}
                                            averageRating={review.rating}
                                          />
                                        </div>
                                        <span className="review-text">
                                          {timeAgo(review.createdAt)}
                                        </span>
                                      </div>
                                    )}
                                    {commentLanguage === "eng" && (
                                      <p className="review-text">
                                        {review.comment}
                                      </p>
                                    )}
                                    {commentLanguage === "spn" && (
                                      <p className="review-text">
                                        {review.spn_comment}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>
                        {sameAddressSearch.map((otherCustomer) => {
                          return (
                            otherCustomer.averageRating > 0 && (
                              <div
                                className="review-card cardBottom"
                                key={otherCustomer._id}
                              >
                                <>
                                  <div className="customer-name p-2 text-start">
                                    <h6 className="m-0 fw-bold">
                                      {otherCustomer.first_name}{" "}
                                      {otherCustomer.last_name}
                                    </h6>
                                  </div>
                                  <div className="d-flex flex-wrap align-items-center justify-content-between customer-rating--outer">
                                    <div className="customer-rating">
                                      <p>{total_reviews} </p>
                                      <div className="">
                                        <p>
                                          {otherCustomer.averageRating > 0
                                            ? otherCustomer.reviewCount
                                            : 0}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="customer-rating">
                                      <p>{ratings}</p>
                                      <div className="d-flex align-items-center gap-2">
                                        <p>{otherCustomer.averageRating}</p>
                                        <ReviewStarRating
                                          size={17}
                                          mode={true}
                                          averageRating={
                                            otherCustomer.averageRating
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="d-flex flex-column gap-1"></div>
                                  </div>
                                  <div className="review-body d-grid grid-two--cols">
                                    {otherCustomer.reviewData.map(
                                      (otherReview) => {
                                        return (
                                          <div
                                            className="business-review"
                                            key={otherReview._id}
                                          >
                                            <div className="">
                                              {otherReview.company_logo !==
                                                null && (
                                                <img
                                                  src={`${IMG_API_BASE_URL}${otherReview.company_logo}`}
                                                  width={30}
                                                  height={30}
                                                  className="img-fluid"
                                                />
                                              )}
                                              <div className="review-description ">
                                                <p className="business-review--name text-break">
                                                  {otherReview.business_name}
                                                </p>
                                                <ReviewStarRating
                                                  size={17}
                                                  mode={true}
                                                  averageRating={
                                                    otherReview.rating
                                                  }
                                                />
                                              </div>
                                              <span className="review-text">
                                                {timeAgo(otherReview.createdAt)}
                                              </span>
                                            </div>
                                            {commentLanguage === "eng" && (
                                              <p className="review-text">
                                                {otherReview.comment}
                                              </p>
                                            )}
                                            {commentLanguage === "eng" && (
                                              <p className="review-text">
                                                {otherReview.spn_comment}
                                              </p>
                                            )}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </>
                              </div>
                            )
                          );
                        })}
                      </>
                    ) : (
                      <>
                        <div className="review-body d-grid grid-two--cols">
                          {sortedReviews.length > 0 && (
                            <>
                              {sortedReviews
                                .filter(
                                  (item) => item.business_name == businessName
                                )
                                .map((review) => {
                                  return (
                                    <div
                                      className="business-review blurText"
                                      key={review._id}
                                    >
                                      {review.rating && (
                                        <div>
                                          {review.company_logo && (
                                            <img
                                              src={`${IMG_API_BASE_URL}${review.company_logo}`}
                                              width={30}
                                              height={30}
                                              className="img-fluid"
                                            />
                                          )}
                                          <div>
                                            <p className="business-review--name text-break">
                                              {review.business_name}
                                            </p>
                                            <ReviewStarRating
                                              size={17}
                                              mode={true}
                                              averageRating={review.rating}
                                            />
                                          </div>
                                          <span className="review-text">
                                            {timeAgo(review.createdAt)}
                                          </span>
                                        </div>
                                      )}
                                      <p className="review-text">
                                        {commentLanguage === "eng" && (
                                          <p className="review-text">
                                            {review.comment}
                                          </p>
                                        )}
                                        {commentLanguage === "spn" && (
                                          <p className="review-text">
                                            {review.spn_comment}
                                          </p>
                                        )}
                                      </p>
                                    </div>
                                  );
                                })}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <>
          {marketingLoder ? (
            ""
          ) : (
            <div className="full-width-carousel">
              <Slider {...settings}>
                {partnerBannerDetails.length > 0 &&
                  partnerBannerDetails.map((partnerData) => {
                    return (
                      <div className="full-width-slide" key={partnerData._id}>
                        <a
                          href={partnerData.website_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${IMG_API_BASE_URL}${partnerData.banner_image}`}
                            alt={partnerData.partnerName}
                            className="slide-image"
                            onClick={() =>
                              handlePartnerClick(
                                partnerData._id,
                                partnerData.partnerId
                              )
                            }
                          />
                        </a>
                      </div>
                    );
                  })}
              </Slider>
            </div>
          )}
        </>

        <AddReviewModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          customerData={searchCustomerData[0]?._id}
          businessData={businessDetails._id}
          setSearchCustomerData={setSearchCustomerData}
          setSameAddressSearch={setSameAddressSearch}
        />
        <SearchCustomerModel
          show={showMoreUserModal}
          onRequestClose={closeMoreUserModal}
        />
        <CustomerAttomModal
          show={showCustomerAttomModal}
          onRequestClose={closeCustomerAttomModal}
          customerAttomData={customerAttomData}
          setSearchCustomerData={setSearchCustomerData}
          setSameAddressSearch={setSameAddressSearch}
          setShowReview={setShowReview}
        />
        <ServiceAreaModal
          show={serviceArea}
          onRequestClose={CloseServiceAreaModal}
          onCloseModel1={CloseServiceAreaModal1}
          serviceAreaPayload={serviceAreaPayload}
          setSearchCustomerData={setSearchCustomerData}
          setSameAddressSearch={setSameAddressSearch}
          setShowReview={setShowReview}
          customer={customer}
          getUserDetail={getUserDetail}
        />
      </section>
    </>
  );
};
