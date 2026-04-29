import {
  MdLanguage,
  MdOutlineBusinessCenter,
  MdOutlineEdit,
  MdOutlineLocationOn,
} from "react-icons/md";
import { Link, useOutletContext } from "react-router-dom";
import customerprofile1 from "../../assets/images/customerprofile1.png";
import { useState, useEffect, useRef } from "react";
import { getBusinessDetails } from "../../services/customer";
import { useFormik } from "formik";
import { BusinessRegistrationSchema } from "../../schema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getAllStates,
  updateBusinessProfile,
  getUserDetails,
} from "../../services/user";
import { toast } from "react-toastify";
import { IMG_API_BASE_URL } from "../../config/config";
import { useDispatch } from "react-redux";
import { getUsersData } from "../../slices/userSlice";
import businessData from "../../config/businessData.json";

/**
 * BusinessProfile component allows users to view and edit their business profile information.
 * It includes fields for business details, owner information, and social media links.
 *
 * @returns {JSX.Element} The rendered business profile form.
 */
export const BusinessProfile = () => {
  const dispatch = useDispatch();
  const [business_id, setBusinessId] = useState("");
  const [businessDetails, setBusinessDetails] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [profileFile, setProfileFile] = useState();
  const [imageUrl, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [otherBusinessType, setOtherBusinessType] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const { collapse, t } = useOutletContext();
  const { businessTypes, businessTitle, companySizes, businessRanges } =
    businessData;
  const language = localStorage.getItem("language");

  const validation = BusinessRegistrationSchema(t("validations"));

  useEffect(() => {
    getUserDetail();
    getStates();
  }, []);

  const validateUrl = (url) => {
    const hasProtocol = /^(https?:\/\/)/.test(url);
    const hasWWW = /^www\./.test(url);
    if (!hasProtocol && !hasWWW) {
      return false;
    }
    const regex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
    return regex.test(url);
  };

  const normalizeUrl = (url) => {
    if (url && url.startsWith("www.")) {
      return "http://" + url;
    }
    return url;
  };

  const {
    valid_URL,
    city,
    enter_city,
    state,
    select_state,
    zip_code,
    enter_zip_code,
    country,
  } = t("formField");

  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_type: "",
      business_other: "",
      business_website: "",
      owner_firstname: "",
      owner_lastname: "",
      title: "",
      company_email: "",
      company_phone: "",
      comapny_size: "",
      business_range: "",
      business_year: "",
      business_address: "",
      address_line2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      instagram: "",
      google: "",
      facebook: "",
    },
    validationSchema: validation,
    validate: (values) => {
      const errors = {};
      if (values.facebook && !validateUrl(normalizeUrl(values.facebook))) {
        errors.facebook = valid_URL;
      }
      if (values.instagram && !validateUrl(normalizeUrl(values.instagram))) {
        errors.instagram = valid_URL;
      }
      if (values.google && !validateUrl(normalizeUrl(values.google))) {
        errors.google = valid_URL;
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const trimmedValue = values?.business_range
          ?.split("-")[1]
          ?.split(" ")[0];
        const updatedBusinessRegistrationInfo = {
          ...values,
          business_id: business_id,
          business_range: `${trimmedValue}m`,
          company_phone: `+${phoneNumber}`,
          business_year: values.business_year.toString(),
          zip: values.zip.toString(),
          company_logo: profileFile,
          instagram: normalizeUrl(values.instagram),
          google: normalizeUrl(values.google),
          facebook: normalizeUrl(values.facebook),
        };

        const response = await updateBusinessProfile(
          updatedBusinessRegistrationInfo
        );

        if (response.success) {
          toast.success(updated_successfully);
          getUserDetail();
          fetchBusinessDetails(business_id);
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    },
  });

  const getStates = async () => {
    const statesData = await getAllStates();
    setAllStates(statesData);
  };

  const convertApiValueToDropdown = (apiValue) => {
    const miles = parseInt(apiValue.replace("m", ""), 10);
    return businessRanges.find((range) => range.includes(miles));
  };
  const fetchBusinessDetails = async (business_id) => {
    try {
      const businessDetailsData = await getBusinessDetails(business_id);
      setBusinessDetails(businessDetailsData.data);
      const dropdownValue = convertApiValueToDropdown(
        businessDetailsData.data.business_range
      );
      formik.setValues({
        business_name: businessDetailsData.data.business_name,
        business_type: businessDetailsData.data.business_type,
        business_other: businessDetailsData.data.business_other,
        business_website: businessDetailsData.data.business_website,
        owner_firstname: businessDetailsData.data.owner_firstname,
        owner_lastname: businessDetailsData.data.owner_lastname,
        company_email: businessDetailsData.data.company_email,
        company_phone: businessDetailsData.data.company_phone,
        comapny_size: businessDetailsData.data.comapny_size,
        business_range: dropdownValue,
        business_year: businessDetailsData.data.business_year,
        business_address: businessDetailsData.data.business_address,
        address_line2: businessDetailsData.data.address_line2,
        city: businessDetailsData.data.city,
        state: businessDetailsData.data.state,
        zip: businessDetailsData.data.zip,
        country: businessDetailsData.data.country,
        facebook: businessDetailsData.data.facebook,
        google: businessDetailsData.data.google,
        instagram: businessDetailsData.data.instagram,
        title: businessDetailsData.data.title,
      });
      const phone_number = businessDetailsData.data.company_phone.slice(1);

      setPhoneNumber(phone_number);
      if (businessDetailsData?.data?.company_logo)
        setImageUrl(
          `${IMG_API_BASE_URL}${businessDetailsData.data.company_logo}`
        );
      setOtherBusinessType(businessDetailsData.data.business_other);
    } catch (error) {
      toast.error(error.response?.data?.data?.message[language]);
    }
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    dispatch(getUsersData(userDetailsData));
    setBusinessId(userDetailsData.business_details[0]._id);
    fetchBusinessDetails(userDetailsData.business_details[0]._id);
    setEmployeeRole(userDetailsData?.user?.user_role);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const maxSize = 1 * 2024 * 2024;

      if (file.size > maxSize) {
        toast.error(size_exceeds);
        fileInputRef.current.value = "";
        return;
      }

      setProfileFile(file);
      const newImageUrl = URL.createObjectURL(file);
      setImageUrl(newImageUrl);
    }
  };

  useEffect(() => {}, [profileFile]);

  const handleBusinessTypeChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("business_type", value);
    if (value === "Other") {
      setOtherBusinessType("");
    }
    if (value != "Other") {
      formik.setFieldValue("business_other", "");
    }
  };

  const {
    size_exceeds,
    updated_successfully,
    edit_business_details,
    edit_business_address,
    legal_entity,
    business_name,
    enter_business_name,
    business_type,
    select_business_type,
    business_website,
    enter_business_website,
    owner_first_name,
    owner_last_name,
    enter_owner_first_name,
    enter_owner_last_name,
    company_email,
    enter_company_email,
    company_phone,
    company_size,
    select_company_size,
    business_range,
    select_business_range,
    years_in_business,
    select_years_in_business,
    business_address,
    enter_business_address,
    business_address_line2,
    enter_business_address_line2,
    social_media,
    not_personal,
    facebook,
    enter_facebook,
    instagram,
    enter_instagram,
    google,
    enter_google_account,
    cancel,
    save_changes,
    title,
    select_business_title,
    other_business_type,
    enter_other_business_type,
  } = t("business_registration");

  return (
    <>
      <section className={`dashboard left-spacing ${collapse ? "expand" : ""}`}>
        <div className="business-profile d-flex flex-wrap align-items-center edit-business-profile">
          <div
            className="position-relative mb-0 businessProfileImage "
            width={80}
            height={80}
          >
            {businessDetails.company_logo || imageUrl ? (
              <img
                src={imageUrl}
                alt="logo"
                width={80}
                height={80}
                className=""
              />
            ) : (
              <img
                src={customerprofile1}
                alt="logo"
                width={80}
                height={80}
                className=""
              />
            )}
            {employeeRole === "employee" ? (
              ""
            ) : (
              <label
                htmlFor="chooseBusinessImg"
                className="edit-business--icon"
              >
                <MdOutlineEdit />
              </label>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="d-none"
              id="chooseBusinessImg"
              accept="image/*"
              onChange={handleImageChange}
              disabled={employeeRole === "employee"}
            />
          </div>
          <div className="mb-0 text-break">
            <h1 className="mb-2">{businessDetails.business_name}</h1>
          </div>
        </div>
        <div className="business-info d-flex flex-wrap align-items-center">
          <div>
            <MdLanguage />
            <span>{businessDetails.business_website}</span>
          </div>
          <div>
            <MdOutlineBusinessCenter />
            <span>{businessDetails.business_type}</span>
          </div>
          <div>
            <MdOutlineLocationOn />
            <span>
              {businessDetails.business_address} {businessDetails.address_line2}
              . {businessDetails.city}, {businessDetails.state},{" "}
              {businessDetails.zip}
            </span>
          </div>
        </div>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="edit-business">
              <div className="dashboard-section first">
                <h3 className="dashboard-section--head global-heading">
                  {edit_business_details}
                </h3>
                <div className="d-grid grid-four--cols profileForm">
                  <div className={`businessname `}>
                    <label htmlFor="ebusinessName" className="form-label">
                      {business_name}{" "}
                      <span className="legal-entity">{legal_entity}</span>
                    </label>
                    <input
                      type="text"
                      id="business_name"
                      name="business_name"
                      value={formik.values.business_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_business_name}
                      className="form-control"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.business_name &&
                    formik.errors.business_name ? (
                      <div className="error">{formik.errors.business_name}</div>
                    ) : null}
                  </div>
                  <div className={`businesstype`}>
                    <label className="form-label">{business_type}</label>
                    <select
                      className="form-select"
                      aria-label="Business Type Select"
                      name="business_type"
                      value={formik.values.business_type}
                      onChange={handleBusinessTypeChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    >
                      <option>{select_business_type}</option>
                      {businessTypes.map((business_type) => (
                        <option key={business_type} value={business_type}>
                          {business_type}
                        </option>
                      ))}
                    </select>
                    {formik.touched.business_type &&
                    formik.errors.business_type ? (
                      <div className="error">{formik.errors.business_type}</div>
                    ) : null}
                  </div>
                  {formik.values.business_type === "Others" && (
                    <div className="business-type">
                      <label htmlFor="otherBusinessType" className="form-label">
                        {other_business_type}
                      </label>
                      <input
                        type="text"
                        id="otherBusinessType"
                        name="otherBusinessType"
                        value={otherBusinessType}
                        onChange={(e) => {
                          setOtherBusinessType(e.target.value);
                          formik.setFieldValue(
                            "business_other",
                            e.target.value
                          );
                        }}
                        onBlur={formik.handleBlur}
                        className="form-control"
                        disabled={employeeRole === "employee"}
                        placeholder={enter_other_business_type}
                      />
                      {formik.touched.business_other &&
                      formik.errors.business_other ? (
                        <div className="error">
                          {formik.errors.business_other}
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div>
                    <label htmlFor="ebusinessWebsite" className="form-label">
                      {business_website}
                    </label>
                    <input
                      type="text"
                      id="business_website"
                      name="business_website"
                      value={formik.values.business_website}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_business_website}
                      className="form-control"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.business_website &&
                    formik.errors.business_website ? (
                      <div className="error">
                        {formik.errors.business_website}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="eownerFirstName" className="form-label">
                      {owner_first_name}
                    </label>
                    <input
                      type="text"
                      id="owner_firstname"
                      name="owner_firstname"
                      value={formik.values.owner_firstname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_owner_first_name}
                      className="form-control"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.owner_firstname &&
                    formik.errors.owner_firstname ? (
                      <div className="error">
                        {formik.errors.owner_firstname}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="eownerLastName" className="form-label">
                      {owner_last_name}
                    </label>
                    <input
                      type="text"
                      id="owner_lastname"
                      name="owner_lastname"
                      value={formik.values.owner_lastname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_owner_last_name}
                      className="form-control"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.owner_lastname &&
                    formik.errors.owner_lastname ? (
                      <div className="error">
                        {formik.errors.owner_lastname}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-label">{title}</label>
                    <select
                      className="form-select"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    >
                      <option>{select_business_title}</option>
                      {businessTitle.map((business_title) => (
                        <option key={business_title} value={business_title}>
                          {business_title}
                        </option>
                      ))}
                    </select>
                    {formik.touched.title && formik.errors.title ? (
                      <div className="error">{formik.errors.title}</div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="ecompanyEmail" className="form-label">
                      {company_email}
                    </label>
                    <input
                      type="text"
                      id="company_email"
                      name="company_email"
                      value={formik.values.company_email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_company_email}
                      className="form-control"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.company_email &&
                    formik.errors.company_email ? (
                      <div className="error">{formik.errors.company_email}</div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="ecompanyPhone" className="form-label">
                      {company_phone}
                    </label>
                    <PhoneInput
                      country={"us"}
                      defaultCountry="US"
                      value={phoneNumber}
                      // prefix="+"
                      onlyCountries={["us"]}
                      // onChange={setPhoneNumber}
                      onChange={(value) => {
                        setPhoneNumber(value);
                        formik.setFieldValue("company_phone", value);
                      }}
                      inputProps={{
                        name: "company_phone",
                        required: true,
                        autoFocus: false,
                      }}
                      disableDropdown
                      onBlur={formik.handleBlur}
                      id="company_phone"
                      name="company_phone"
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.company_phone &&
                    formik.errors.company_phone ? (
                      <div className="error">{formik.errors.company_phone}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-label">{company_size}</label>
                    <select
                      className="form-select"
                      aria-label="Select Company Size"
                      name="comapny_size"
                      value={formik.values.comapny_size}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    >
                      <option>{select_company_size}</option>
                      {companySizes.map((comapny_size) => (
                        <option key={comapny_size} value={comapny_size}>
                          {comapny_size}
                        </option>
                      ))}
                    </select>
                    {formik.touched.comapny_size &&
                    formik.errors.comapny_size ? (
                      <div className="error">{formik.errors.comapny_size}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-label">{business_range}</label>
                    <select
                      className="form-select"
                      aria-label="Select Company Size"
                      name="business_range"
                      value={formik.values.business_range}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    >
                      <option>{select_business_range}</option>
                      {businessRanges.map((business_range) => (
                        <option key={business_range} value={business_range}>
                          {business_range}
                        </option>
                      ))}
                    </select>
                    {formik.touched.business_range &&
                    formik.errors.business_range ? (
                      <div className="error">
                        {formik.errors.business_range}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="eyearsInBusiness" className="form-label">
                      {years_in_business}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="business_year"
                      name="business_year"
                      value={formik.values.business_year}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={select_years_in_business}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.business_year &&
                    formik.errors.business_year ? (
                      <div className="error">{formik.errors.business_year}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-business">
              <div className="dashboard-section">
                <h3 className="dashboard-section--head global-heading">
                  {edit_business_address}
                </h3>
                <div className="d-grid grid-four--cols profileForm">
                  <div className="businessname">
                    <label htmlFor="ebusinessAddress" className="form-label">
                      {business_address}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="business_address"
                      placeholder={enter_business_address}
                      name="business_address"
                      value={formik.values.business_address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.business_address &&
                    formik.errors.business_address ? (
                      <div className="error">
                        {formik.errors.business_address}
                      </div>
                    ) : null}
                  </div>
                  <div className="businesstype">
                    <label
                      htmlFor="ebusinessAddressLine2"
                      className="form-label"
                    >
                      {business_address_line2}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address_line2"
                      placeholder={enter_business_address_line2}
                      name="address_line2"
                      value={formik.values.address_line2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.address_line2 &&
                    formik.errors.address_line2 ? (
                      <div className="error">{formik.errors.address_line2}</div>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="ebusinessCity" className="form-label">
                      {city}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder={enter_city}
                      name="city"
                      value={formik.values.city}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.city && formik.errors.city ? (
                      <div className="error">{formik.errors.city}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-label">{state}</label>
                    <select
                      className="form-select"
                      aria-label="Select State"
                      name="state"
                      value={formik.values.state}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    >
                      <option>{select_state}</option>
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
                  <div>
                    <label htmlFor="ebusinessZipCode" className="form-label">
                      {zip_code}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="businessZipCode"
                      placeholder={enter_zip_code}
                      name="zip"
                      value={formik.values.zip}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.touched.zip && formik.errors.zip ? (
                      <div className="error">{formik.errors.zip}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="form-label">{country}</label>
                    <select
                      className="form-select"
                      aria-label="Select Country"
                      name="country"
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled
                    >
                      {/* <option>{select_country}</option> */}
                      <option key="United States" value="United States">
                        United States
                      </option>
                    </select>
                    {formik.touched.country && formik.errors.country ? (
                      <div className="error">{formik.errors.country}</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-business">
              <div className="dashboard-section">
                <h3 className="dashboard-section--head global-heading">
                  {social_media}
                  <small>({not_personal})</small>
                </h3>
                <div className="d-grid grid-three--cols profileForm">
                  <div>
                    <label htmlFor="facebook" className="form-label">
                      {facebook}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="facebook"
                      placeholder={enter_facebook}
                      name="facebook"
                      value={formik.values.facebook}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.errors.facebook && formik.touched.facebook && (
                      <div className="error">{formik.errors.facebook}</div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="instagram" className="form-label">
                      {instagram}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="instagram"
                      placeholder={enter_instagram}
                      name="instagram"
                      value={formik.values.instagram}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.errors.instagram && formik.touched.instagram && (
                      <div className="error">{formik.errors.instagram}</div>
                    )}
                  </div>
                  <div>
                    <label htmlFor="google" className="form-label">
                      {google}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="google"
                      placeholder={enter_google_account}
                      name="google"
                      value={formik.values.google}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={employeeRole === "employee"}
                    />
                    {formik.errors.google && formik.touched.google && (
                      <div className="error">{formik.errors.google}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-business-btns">
              {employeeRole == "employee" ? (
                ""
              ) : (
                <button type="button" className="button close-btn bg-white">
                  <Link to="/app/dashboard" title="Cancel">
                    {cancel}
                  </Link>
                </button>
              )}
              {employeeRole == "employee" ? (
                ""
              ) : (
                <button
                  type="submit"
                  title="Save Changes"
                  className="button px-3"
                >
                  {save_changes}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
