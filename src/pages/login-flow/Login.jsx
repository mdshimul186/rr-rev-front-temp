import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Banner } from "../../components/UI/Banner";
import {
  MdMailOutline,
  MdLockOutline,
  MdOutlineVisibilityOff,
  MdOutlineVisibility,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { login } from "../../services/user";
import { useFormik } from "formik";
import { loginSchema } from "../../schema";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../../slices/authSlice";
import CryptoJS from "crypto-js";

/**
 * Login component handles the verification for user login.
 * It allows users to enter their credentials.
 *
 * @returns {JSX.Element} The rendered login verification component.
 */

export const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationToken, setVerificationToken] = useState();

  const t = useOutletContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = localStorage.getItem("language") || "eng";

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail && savedPassword) {
      formik.setFieldValue("email", savedEmail);
      const decryptedPassword = CryptoJS.AES.decrypt(
        savedPassword,
        "BuoBSnVNZbstVOxLZVJvDRwi9UmJkH"
      ).toString(CryptoJS.enc.Utf8);
      formik.setFieldValue("password", decryptedPassword);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const validation = loginSchema(t("validations"));
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      const updatedLoginInfo = {
        ...values,
      };
      if (rememberMe) {
        localStorage.setItem("email", values.email);
        const encryptedPassword = CryptoJS.AES.encrypt(
          values.password,
          "BuoBSnVNZbstVOxLZVJvDRwi9UmJkH"
        ).toString();
        localStorage.setItem("password", encryptedPassword);
      } else {
        localStorage.removeItem("password");
      }
      try {
        const response = await login(updatedLoginInfo);
        if (response.success) {
          localStorage.setItem("isRegistered", false);
          setVerificationToken(response.token);
          dispatch(setAuthToken(response.token));
          navigate("/verification-modal", { state: verificationToken });

          localStorage.setItem("email", values.email);
          localStorage.setItem("contact", response.contact);
          resetForm();
          setIsSubmitting(true);
        }
      } catch (error) {
        if (error.response.data.data.verify === false) {
          localStorage.setItem("email", values.email);
          localStorage.setItem("contact", error.response.data.data.contact);
          navigate("/verification", { state: "verificationSentOtp" });
        }
        toast.error(error.response?.data?.data?.message[language]);
      }
    },
  });

  const { email, enter_email, password, enter_password } = t("formField");
  const {
    login_text,
    login_account,
    welcome,
    remember,
    forgot_pass,
    not_account,
    reg_here,
  } = t("login");

  return (
    <>
      <title>Login - Resident Review</title>
      <Banner content={login_text} />
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section">
            <h2 className="global-heading">{login_account}</h2>
            <p>{welcome}</p>
            <form onSubmit={formik.handleSubmit}>
              <div>
                <label htmlFor="email" className="form-label">
                  {email}
                </label>
                <div className="position-relative">
                  <MdMailOutline />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={enter_email}
                    className="form-control"
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="error">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="password" className="form-label">
                  {password}
                </label>
                <div className="position-relative">
                  <MdLockOutline />
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
                {formik.touched.password && formik.errors.password ? (
                  <div className="error">{formik.errors.password}</div>
                ) : null}
              </div>
              <div className="d-flex align-items-center justify-content-between login-checkbox">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" className="form-check-label ms-2">
                    {remember}
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  title={forgot_pass}
                  className="forgot-pass"
                >
                  {forgot_pass}
                </Link>
              </div>
              <button
                type="submit"
                title={login_text}
                disabled={isSubmitting}
                className="button w-100"
              >
                {login_text}
              </button>
              <p className="text-center">
                {not_account}{" "}
                <Link
                  to="/register"
                  title={reg_here}
                  className="highlight-text"
                >
                  {reg_here}
                </Link>
              </p>
            </form>
          </div>
          <div className="login-background"></div>
        </div>
      </section>
    </>
  );
};
