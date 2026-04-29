import React, { useState, useEffect, useRef } from "react";
import { MdOutlineRemove } from "react-icons/md";
import { Banner } from "../../components/UI/Banner";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { BusinessRegistrationSchema } from "../../schema";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  getAllStates,
  createBusinessRegister,
  getUserDetails,
} from "../../services/user";
import { getUsersData } from "../../slices/userSlice";
import { toast } from "react-toastify";
import {
  setRegisterCounter,
  clearRegisterCounter,
} from "../../slices/authSlice";
import { MiddeskBusinessRegistrationModal } from "../../components/UI/MiddeskBusinessRegistrationModal";
import businessData from "../../config/businessData.json";
import { errorMessages } from "../../config/businessRegistration.json";
import { YES } from "../../config/constant";

/**
 * BusinessRegistration component handles the registration process for a business.
 * It collects various details about the business and its owner, including EIN, business type, and address.
 *
 * @returns {JSX.Element} The rendered business registration component.
 */
export const BusinessRegistration = () => {
  const [updatedBusinessRegistrationInfo, setUpdatedBusinessRegistrationInfo] =
    useState({});
  const { registerCounter } = useSelector((state) => state.auth);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [otherBusinessType, setOtherBusinessType] = useState("");
  const [businessRangeValue, setBusinessRangeValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useOutletContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { businessTypes, businessTitle, companySizes, businessRanges } =
    businessData;
  const einInputRefs = useRef([]);
  einInputRefs.current = new Array(9)
    .fill()
    .map((_, index) => einInputRefs.current[index] || React.createRef());
  const language = localStorage.getItem("language");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newEinNumber = [...formik.values.einNumber];
      newEinNumber[index] = value;

      formik.setFieldValue("einNumber", newEinNumber);

      if (value && index < 8) {
        einInputRefs.current[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const value = e.target.value;

    if (e.key === "Backspace" && !value && index > 0) {
      formik.setFieldValue("einNumber", [
        ...formik.values.einNumber.slice(0, index),
        "",
        ...formik.values.einNumber.slice(index + 1),
      ]);

      einInputRefs.current[index - 1].current.focus();
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedValue = e.clipboardData.getData("text").replace(/\D/g, "");
    const sanitizedValue = pastedValue.slice(0, 9);

    let newEinNumber = [...formik.values.einNumber];

    sanitizedValue.split("").forEach((digit, i) => {
      if (index + i < 9) {
        newEinNumber[index + i] = digit;
      }
    });
    for (let i = index + sanitizedValue.length; i < 9; i++) {
      newEinNumber[i] = "";
    }

    formik.setFieldValue("einNumber", newEinNumber);
    const nextFocusIndex = Math.min(index + sanitizedValue.length, 8);
    einInputRefs.current[nextFocusIndex]?.current.focus();
  };

  const validation = BusinessRegistrationSchema(t("validations"));
  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_type: "",
      business_other: "",
      business_website: "",
      owner_firstname: "",
      owner_lastname: "",
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
      country: "United States",
      title: "",
      einNumber: ["", "", "", "", "", "", "", "", ""],
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      dispatch(setRegisterCounter());
      try {
        const einNumbers = values?.einNumber.join("");
        if (values?.business_range) {
          const trimmedValue = values?.business_range
            ?.split("-")[1]
            .split(" ")[0];
          setBusinessRangeValue(trimmedValue);
        }

        let _updatedBusinessRegistrationInfo = {
          ...values,
          business_range: `${businessRangeValue}m`,
          company_phone: `+${phoneNumber}`,
          ein_number: einNumbers,
          business_year: values.business_year.toString(),
          zip: values.zip.toString(),
          req_time: registerCounter,
          with: YES,
        };

        setUpdatedBusinessRegistrationInfo(_updatedBusinessRegistrationInfo);
        delete _updatedBusinessRegistrationInfo.einNumber;

        const response = await createBusinessRegister(
          _updatedBusinessRegistrationInfo
        );
        if (response.data.success) {
          dispatch(clearRegisterCounter());
          resetForm();
          setPhoneNumber("");
          getUserDetail();
        }
      } catch (error) {
        toast.error(error.response?.data?.data?.message[language]);

        const errors = error.response?.data?.data?.message.reduce(
          (acc, { description, code }) => {
            const errorMessage = getErrorMessage(code, language, description);

            switch (code) {
              case "I105":
              case "E1201":
              case "I103":
              case "I104":
                acc.einNumber = errorMessage;
                break;
              case "I302":
              case "I304":
              case "I305":
              case "I306":
                acc.business_name = errorMessage;
                break;
              case "I108":
              case "I109":
              case "I111":
              case "I112":
                acc.business_address = errorMessage;
                break;
              case "I602":
              case "I604":
              case "I605":
                acc.owner_firstname = errorMessage;
                acc.owner_lastname = errorMessage;
                break;

              default:
                break;
            }

            return acc;
          },
          {}
        );

        formik.setErrors(errors);
        if (updatedBusinessRegistrationInfo.req_time >= 2) {
          setIsModalOpen(true);
        }
      }
    },
  });

  function getErrorMessage(code, language, description) {
    if (language === "spn") {
      return errorMessages[code] || "Error desconocido";
    } else {
      return description;
    }
  }

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    dispatch(getUsersData(userDetailsData));
    localStorage.setItem("isRegistered", true);
    navigate("/app/dashboard");
  };

  const getStates = async () => {
    const statesData = await getAllStates();
    setAllStates(statesData);
  };

  useEffect(() => {
    getStates();
  }, []);

  const handleBusinessTypeChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue("business_type", value);
    if (value === "Others") {
      setOtherBusinessType("");
    }
  };

  const onRequestClose = async () => {
    setIsModalOpen(false);
  };

  const {
    legal_entity,
    business_registration_text,
    register_business,
    business_name,
    enter_business_name,
    business_type,
    select_business_type,
    business_website,
    enter_business_website,
    business_details,
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
    address_details,
    business_address,
    enter_business_address,
    business_address_line2,
    enter_business_address_line2,
    ein_number,
    title,
    select_business_title,
    other_business_type,
    enter_other_business_type,
  } = t("business_registration");

  const {
    city,
    enter_city,
    state,
    select_state,
    zip_code,
    enter_zip_code,
    country,
  } = t("formField");

  const { continue_text } = t("verification");

  return (
    <>
      <Banner content={business_registration_text} />
      <section className="wrapper">
        <div className="business-register spacing">
          <h2 className="text-center global-heading">{register_business}</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-section bg-white">
              <div className="row g-4">
                <h3 className="global-heading">{business_details}</h3>
                <div className="col-md-6">
                  <label htmlFor="businessName" className="form-label">
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
                  />
                  {formik.touched.business_name &&
                  formik.errors.business_name ? (
                    <div className="error">{formik.errors.business_name}</div>
                  ) : null}
                </div>

                <div
                  className={` ${
                    formik.values.business_type === "Others"
                      ? `col-md-3`
                      : `col-md-6`
                  }`}
                >
                  <label className="form-label">{business_type}</label>
                  <select
                    className="form-select"
                    aria-label="Business Type Select"
                    name="business_type"
                    value={formik.values.business_type}
                    onChange={handleBusinessTypeChange}
                    onBlur={formik.handleBlur}
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
                  <div className="col-md-3">
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
                        formik.setFieldValue("business_other", e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      className="form-control"
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
                <div className="col-md-4">
                  <label htmlFor="businessWebsite" className="form-label">
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
                  />
                  {formik.touched.business_website &&
                  formik.errors.business_website ? (
                    <div className="error">
                      {formik.errors.business_website}
                    </div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label htmlFor="ownerFirstName" className="form-label">
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
                  />
                  {formik.touched.owner_firstname &&
                  formik.errors.owner_firstname ? (
                    <div className="error">{formik.errors.owner_firstname}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label htmlFor="ownerLastName" className="form-label">
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
                  />
                  {formik.touched.owner_lastname &&
                  formik.errors.owner_lastname ? (
                    <div className="error">{formik.errors.owner_lastname}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label">{title}</label>
                  <select
                    className="form-select"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                <div className="col-md-4">
                  <label htmlFor="companyEmail" className="form-label">
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
                  />
                  {formik.touched.company_email &&
                  formik.errors.company_email ? (
                    <div className="error">{formik.errors.company_email}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label htmlFor="companyPhone" className="form-label">
                    {company_phone}
                  </label>
                  <PhoneInput
                    country={"us"}
                    defaultCountry="US"
                    value={phoneNumber}
                    prefix="+"
                    onChange={setPhoneNumber}
                    inputProps={{
                      name: "company_phone",
                      required: true,
                      autoFocus: false,
                    }}
                    disableDropdown
                    onBlur={() =>
                      formik.setFieldValue("company_phone", phoneNumber)
                    }
                  />
                  {formik.touched.company_phone &&
                  formik.errors.company_phone ? (
                    <div className="error">{formik.errors.company_phone}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label">{company_size}</label>
                  <select
                    className="form-select"
                    aria-label="Select Company Size"
                    name="comapny_size"
                    value={formik.values.comapny_size}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option>{select_company_size}</option>
                    {companySizes.map((comapny_size) => (
                      <option key={comapny_size} value={comapny_size}>
                        {comapny_size}
                      </option>
                    ))}
                  </select>
                  {formik.touched.comapny_size && formik.errors.comapny_size ? (
                    <div className="error">{formik.errors.comapny_size}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label">{business_range}</label>
                  <select
                    className="form-select"
                    aria-label="Select Company Size"
                    name="business_range"
                    value={formik.values.business_range}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    <div className="error">{formik.errors.business_range}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label htmlFor="yearsInBusiness" className="form-label">
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
                  />
                  {formik.touched.business_year &&
                  formik.errors.business_year ? (
                    <div className="error">{formik.errors.business_year}</div>
                  ) : null}
                </div>
              </div>
              <h3 className="global-heading">{address_details}</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <label htmlFor="businessAddress" className="form-label">
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
                  />
                  {formik.touched.business_address &&
                  formik.errors.business_address ? (
                    <div className="error">
                      {formik.errors.business_address}
                    </div>
                  ) : null}
                </div>
                <div className="col-md-6">
                  <label htmlFor="businessAddressLine2" className="form-label">
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
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="businessCity" className="form-label">
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
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <div className="error">{formik.errors.city}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label">{state}</label>
                  <select
                    className="form-select"
                    aria-label="Select State"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                <div className="col-md-4">
                  <label htmlFor="businessZipCode" className="form-label">
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
                  />
                  {formik.touched.zip && formik.errors.zip ? (
                    <div className="error">{formik.errors.zip}</div>
                  ) : null}
                </div>
                <div className="col-md-4">
                  <label className="form-label">{country}</label>
                  <select
                    className="form-select"
                    aria-label="Select Country"
                    name="country"
                    value={formik.values.country}
                    onBlur={formik.handleBlur}
                    disabled
                  >
                    <option value="United States">United States</option>
                  </select>
                  {formik.touched.country && formik.errors.country ? (
                    <div className="error">{formik.errors.country}</div>
                  ) : null}
                </div>
                <div className="col-12 text-center mt-0">
                  <h3>{ein_number}</h3>
                  <div className="otp-field d-flex align-items-center justify-content-center flex-wrap">
                    {formik.values.einNumber.map((digit, index) => (
                      <React.Fragment key={index}>
                        <input
                          type="tel"
                          id={`ein-number-${index}`}
                          maxLength={1}
                          className="form-control"
                          value={digit}
                          onChange={(e) => handleChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={(e) => handlePaste(e, index)}
                          ref={einInputRefs.current[index]}
                        />
                        {index === 1 && (
                          <MdOutlineRemove className="position-static" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {formik.errors.einNumber ? (
                    <div className="error">{formik.errors.einNumber}</div>
                  ) : null}
                </div>
              </div>
              <div className="p-3"></div>
            </div>
            <div className="business-btns">
              <button type="submit" title={continue_text} className="button">
                {continue_text}
              </button>
            </div>
          </form>
          <MiddeskBusinessRegistrationModal
            show={isModalOpen}
            onRequestClose={onRequestClose}
            UpdatedBusinessRegistrationInfo={updatedBusinessRegistrationInfo}
          />
        </div>
        <div className="login-background"></div>
      </section>
    </>
  );
};
