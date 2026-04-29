import { useEffect, useState } from "react";
import bannerImage from "../../assets/images/banner-map.png";
import PhoneInput from "react-phone-input-2";
import { useFormik } from "formik";
import { ContactUs } from "../../schema";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { contactUs } from "../../services/user";
import { CONTACT_ADDRESS } from "../../config/constant";

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

/**
 * Contact component provides a form for users to contact the business.
 * It includes input fields for the user's first name, last name, email, phone number, subject, and message.
 * It also integrates with a phone input and performs form validation before submitting the contact details.
 *
 * @returns {JSX.Element} The rendered Contact form component.
 *
 */
export const Contact = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState("");
  const t = useOutletContext();
  const validation = ContactUs(t("validations"));

  const languages = localStorage.getItem("language");
  useEffect(() => {
    if (languages === "eng") {
      setLanguage("en-US");
    } else if (languages === "spn") {
      setLanguage("es-MX");
    }
  }, [languages]);

  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_API_KEY}&q=${encodeURIComponent(
    CONTACT_ADDRESS
  )}&language=${language}`;

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      contact: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { first_name, last_name, email, subject, message } = values;
        const payload = {
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          email,
          subject: subject.trim(),
          message: message.trim(),
          contact: `+${phoneNumber}`,
        };

        const response = await contactUs(payload);
        if (response.success) {
          toast.success(response.data);
          resetForm();
          setPhoneNumber("");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.message || error_occurred);
        } else {
          toast.error(unexpected_error);
        }
      }
    },
  });

  const {
    first_name,
    last_name,
    email,
    mobile_number,
    enter_first_name,
    enter_last_name,
    enter_customer_email,
  } = t("formField");

  const { error_occurred, unexpected_error } = t("userComponent");

  return (
    <>
      <title>Contact - Resident Review</title>
      <main className="main-container">
        <section className="banner-section about-us-banner">
          <div className="banner position-relative">
            <img src={bannerImage} />
            <div className="banner-content">
              <div className="banner-text">
                <h1>{t("header.contact")} </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-us-section">
          <div className="container">
            <div className="contact-us-area">
              <div className="contact-us-heading d-flex align-items-center flex-column gap-3">
                <h6>{t("header.contact")}</h6>
                <h1 className="custom-heading">{t("home.need_help")}</h1>
              </div>
              <div className="row gy-3 mt-5">
                <div className="col-lg-6">
                  <div className="contact-form">
                    <form action="" onSubmit={formik.handleSubmit}>
                      <div className="row gy-4">
                        <div className="col-md-6 mb-4">
                          <div className="input-field">
                            <label htmlFor="first_name" className="form-label">
                              {first_name}
                            </label>
                            <input
                              type="text"
                              id="first_name"
                              name="first_name"
                              value={formik.values.first_name}
                              onChange={(e) => {
                                const value = e.target.value.trimStart();
                                formik.setFieldValue("first_name", value);
                              }}
                              onBlur={formik.handleBlur}
                              placeholder={enter_first_name}
                              className="form-control"
                            />
                            {formik.touched.first_name &&
                              formik.errors.first_name && (
                                <div className="error">
                                  {formik.errors.first_name}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="input-field">
                            <label htmlFor="last_name" className="form-label">
                              {last_name}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="last_name"
                              placeholder={enter_last_name}
                              value={formik.values.last_name}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (!/\s/.test(value)) {
                                  formik.setFieldValue("last_name", value);
                                }
                              }}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.last_name &&
                              formik.errors.last_name && (
                                <div className="error">
                                  {formik.errors.last_name}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="col-md-6 mb-4">
                          <div className="input-field">
                            <label htmlFor="email" className="form-label">
                              {email}
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              placeholder={enter_customer_email}
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="error">{formik.errors.email}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6 mb-4">
                          <div className="input-field">
                            <label htmlFor="contact" className="form-label">
                              {mobile_number}
                            </label>
                            <PhoneInput
                              country={"us"}
                              defaultCountry="US"
                              value={phoneNumber}
                              prefix="+"
                              // onlyCountries={['us']}
                              id="contact"
                              onChange={setPhoneNumber}
                              inputProps={{
                                name: "contact",
                                required: true,
                                autoFocus: false,
                              }}
                              onlyCountries={["us", "in"]}
                              // disableDropdown
                              onBlur={() =>
                                formik.setFieldValue("contact", phoneNumber)
                              }
                            />
                            {formik.touched.contact && formik.errors.contact ? (
                              <div className="error">
                                {formik.errors.contact}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-field">
                            <label htmlFor="subject" className="form-label">
                              {t("home.subject")}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="subject"
                              placeholder={t("formField.enter_subject")}
                              value={formik.values.subject}
                              onChange={(e) => {
                                const value = e.target.value.trimStart();
                                formik.setFieldValue("subject", value);
                              }}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.subject &&
                              formik.errors.subject && (
                                <div className="error">
                                  {formik.errors.subject}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="input-field">
                            <label htmlFor="message" className="form-label">
                              {t("userComponent.message")}
                            </label>
                            <textarea
                              id="message"
                              className="form-control"
                              placeholder={t("formField.your_message")}
                              value={formik.values.message}
                              onChange={(e) => {
                                const value = e.target.value.trimStart();
                                formik.setFieldValue("message", value);
                              }}
                              onBlur={formik.handleBlur}
                            ></textarea>
                            {formik.touched.message &&
                              formik.errors.message && (
                                <div className="error">
                                  {formik.errors.message}
                                </div>
                              )}
                          </div>
                        </div>
                        <div className="col-md-12 text-end">
                          <button className="custom-btn" type="submit">
                            <span>{t("formField.send_message")} </span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="contact-map">
                    <iframe
                      src={mapSrc}
                      width="600"
                      height="517"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="border-0 flex-grow-1 "
                    ></iframe>
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
