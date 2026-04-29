import {
  Link,
  useNavigate,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { Banner } from "../../components/UI/Banner";
import { MdOutlineVisibilityOff, MdOutlineVisibility } from "react-icons/md";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signup, employeeSignup } from "../../services/user";
import { useFormik } from "formik";
import { SignupSchema } from "../../schema";
import { toast } from "react-toastify";
import { TermsAndConditionModal } from "../../components/UI/TermsAndCondition";

/**
 * Register component handles the user registration process.
 * It allows users to input their personal information, including name, phone number, email, and password.
 * It also includes a modal for terms and conditions.
 *
 * @returns {JSX.Element} The rendered registration component.
 */

export const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [employeeToken, setEmployeeToken] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [confPasswordShown, setConfPasswordShown] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const t = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfPasswordShown(confPasswordShown ? false : true);
  };
  const validation = SignupSchema(t("validations"));

  useEffect(() => {}, [validation]);
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      contact: "",
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      const language = localStorage.getItem("language");
      const updatedSignupInfo = {
        ...values,
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        contact: `+${phoneNumber}`,
        lang: language,
        terms: 1,
      };
      try {
        if (location.search) {
          const updatedEmployeeSignupInfo = {
            ...values,
            first_name: values.first_name.trim(),
            last_name: values.last_name.trim(),
            email: values.email.trim(),
            contact: `+${phoneNumber}`,
            lang: language,
            terms: 1,
            token: employeeToken,
          };

          const response = await employeeSignup(updatedEmployeeSignupInfo);
          if (response) {
            localStorage.setItem("email", values.email);
            localStorage.setItem("contact", `+${phoneNumber}`);
            resetForm();
            setPhoneNumber("");
            setTimeout(() => {
              navigate("/verification");
            }, 1000);
          }
        } else {
          const response = await signup(updatedSignupInfo);
          if (response) {
            localStorage.setItem("email", values.email);
            localStorage.setItem("contact", `+${phoneNumber}`);
            resetForm();
            setPhoneNumber("");
            setTimeout(() => {
              navigate("/verification");
            }, 1000);
          }
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const tokenParam = params.get("token");

    setEmployeeToken(tokenParam);
    if (emailParam) {
      formik.setFieldValue("email", emailParam);
    }
  }, [location.search, formik.values.email]);

  const {
    first_name,
    enter_first_name,
    last_name,
    enter_last_name,
    phone,
    email,
    enter_email,
    password,
    enter_password,
    confirm_password,
    enter_confirm_password,
  } = t("formField");

  const {
    registration,
    register_account,
    get_account,
    register_condition,
    terms,
    create_account,
    already_account,
    signin_here,
  } = t("register");
  return (
    <>
      <title>Register - Resident Review</title>
      <Banner content={registration} />
      <section className="wrapper">
        <div className="login register d-grid bg-white">
          <div className="form-section register-section mx-0">
            <h2 className="global-heading">{register_account}</h2>
            <p>{get_account}</p>
            <form onSubmit={formik.handleSubmit}>
              <div className="d-grid grid-two--cols">
                <div>
                  <label htmlFor="firstName" className="form-label">
                    {first_name}
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formik.values.first_name}
                    // onChange={formik.handleChange}
                    onChange={(e) => {
                      const value = e.target.value.trimStart();
                      formik.setFieldValue("first_name", value);
                    }}
                    onBlur={formik.handleBlur}
                    placeholder={enter_first_name}
                    className="form-control"
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className="error">{formik.errors.first_name}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lastName" className="form-label">
                    {last_name}
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={enter_last_name}
                    className="form-control"
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className="error">{formik.errors.last_name}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">
                    {phone}
                  </label>
                  <PhoneInput
                    country={"us"}
                    defaultCountry="US"
                    value={phoneNumber}
                    prefix="+"
                    onChange={setPhoneNumber}
                    inputProps={{
                      name: "contact",
                      required: true,
                      autoFocus: false,
                    }}
                    onlyCountries={["us", "in"]}
                    // disableDropdown
                    onBlur={() => formik.setFieldValue("contact", phoneNumber)}
                  />
                  {formik.touched.contact && formik.errors.contact ? (
                    <div className="error">{formik.errors.contact}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    {email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={enter_email}
                    className="form-control"
                    disabled={!!location.search}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="password" className="form-label">
                    {password}
                  </label>
                  <div className="position-relative">
                    <input
                      type={passwordShown ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_password}
                      className="form-control"
                    />
                    {passwordShown ? (
                      <MdOutlineVisibility
                        onClick={togglePasswordVisiblity}
                        className="eye-icon"
                      />
                    ) : (
                      <MdOutlineVisibilityOff
                        onClick={togglePasswordVisiblity}
                        className="eye-icon"
                      />
                    )}
                  </div>
                  <div className="guidelines">
                    <span className="me-1 astrik-symbol"> *</span>
                    <p>{t("validations.password_number")}</p>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    {confirm_password}
                  </label>
                  <div className="position-relative">
                    <input
                      type={confPasswordShown ? "text" : "password"}
                      id="confirmpassword"
                      name="confirmpassword"
                      value={formik.values.confirmpassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_confirm_password}
                      className="form-control"
                    />
                    {confPasswordShown ? (
                      <MdOutlineVisibility
                        onClick={toggleConfirmPasswordVisiblity}
                        className="eye-icon"
                      />
                    ) : (
                      <MdOutlineVisibilityOff
                        onClick={toggleConfirmPasswordVisiblity}
                        className="eye-icon"
                      />
                    )}
                  </div>
                  {formik.touched.confirmpassword &&
                  formik.errors.confirmpassword ? (
                    <div className="error">{formik.errors.confirmpassword}</div>
                  ) : null}
                </div>
              </div>
              <div className="align-items-center justify-content-between login-checkbox">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    value={formik.values.terms}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`form-check-input ${
                      formik.errors.terms && formik.touched.terms
                        ? "invalid-checkbox"
                        : ""
                    }`}
                    id="terms"
                  />
                  <label htmlFor="terms" className="form-check-label ms-2">
                    {register_condition}{" "}
                    <Link
                      title={terms}
                      className="highlight-text"
                      onClick={openModal}
                    >
                      {terms}.
                    </Link>
                  </label>
                </div>
                {formik.touched.terms && formik.errors.terms ? (
                  <div className="error">{formik.errors.terms}</div>
                ) : null}
              </div>
              <button
                type="submit"
                title={create_account}
                className="button w-100"
              >
                {create_account}
              </button>
              <p className="text-center">
                {already_account}{" "}
                <Link
                  to="/login"
                  title={signin_here}
                  className="highlight-text"
                >
                  {signin_here}
                </Link>
              </p>
            </form>
            <TermsAndConditionModal
              isOpen={isModalOpen}
              onRequestClose={closeModal}
            />
            {/* <p>{already_account} <Link to="/signin">{signin_here}</Link></p> */}
          </div>
          <div className="login-background"></div>
        </div>
      </section>
    </>
  );
};
