import {
  Link,
  useNavigate,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Banner } from "../../components/UI/Banner";
import {
  MdArrowBack,
  MdOutlineVisibilityOff,
  MdLockOutline,
  MdMailOutline,
  MdOutlineVisibility,
} from "react-icons/md";
import { ChangedPasswordModal } from "../../components/UI/ChangedPasswordModal";
import {
  resetPassword,
  resendVerifyUser,
  forgotPassword,
} from "../../services/user";
import { useFormik } from "formik";
import { resetPasswordSchema } from "../../schema";
import { toast } from "react-toastify";
import CryptoJS from "crypto-js";

/**
 * ResetPassword component handles the password reset process for users.
 * It allows users to enter an OTP sent to their email and set a new password.
 *
 * @returns {JSX.Element} The rendered reset password component.
 */
export const ResetPassword = () => {
  const location = useLocation();
  const forgotOtp = location.state;
  const language = localStorage.getItem("language");

  const t = useOutletContext();
  const navigate = useNavigate();
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [verifyEmail, setVerifyEmail] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confPasswordShown, setConfPasswordShown] = useState(false);
  const [requiredOtp, setRequiredOtp] = useState("");
  const [otpComplete, setOtpComplete] = useState(false);

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const toggleConfirmPasswordVisiblity = () => {
    setConfPasswordShown(confPasswordShown ? false : true);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (emailOtp[index]) {
        const newEmailOtp = [...emailOtp];
        newEmailOtp[index] = "";
        setEmailOtp(newEmailOtp);
      } else if (index > 0) {
        const newEmailOtp = [...emailOtp];
        newEmailOtp[index - 1] = "";
        setEmailOtp(newEmailOtp);
        document.getElementById(`email-otp-${index - 1}`).focus();
      }
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newEmailOtp = [...emailOtp];
      newEmailOtp[index] = value;
      setEmailOtp(newEmailOtp);
      if (newEmailOtp.every((digit) => digit !== "")) {
        setOtpComplete(true);
      } else {
        setOtpComplete(false);
      }
      if (value && index < 5) {
        document.getElementById(`email-otp-${index + 1}`).focus();
      }
    }
  };

  const handlePaste = (e, index) => {
    const pastedData = e.clipboardData.getData("text");
    const newOtp = pastedData.split("").slice(0, 6);
    const newEmailOtp = [...emailOtp];

    newOtp.forEach((digit, i) => {
      if (i + index < 6) {
        newEmailOtp[i + index] = digit;
        document.getElementById(`email-otp-${i + index}`).value = digit;
      }
    });

    setEmailOtp(newEmailOtp);
    for (let i = 0; i < 6; i++) {
      if (!newEmailOtp[i]) {
        document.getElementById(`email-otp-${i}`).focus();
        break;
      }
    }
  };

  const validation = resetPasswordSchema(t("validations"));

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validation,

    onSubmit: async (values) => {
      setRequiredOtp("");
      setOtpComplete(false);
      const email = localStorage.getItem("email");
      const otp = emailOtp.join("");
      const updatedResetPasswordInfo = {
        password: values.password,
        token: otp,
        email,
      };
      try {
        const response = await resetPassword(updatedResetPasswordInfo);
        if (response) {
          toast.success(password_successfully);
          localStorage.removeItem("password");
          const encryptedPassword = CryptoJS.AES.encrypt(
            values.password,
            "BuoBSnVNZbstVOxLZVJvDRwi9UmJkH"
          ).toString();
          localStorage.setItem("password", encryptedPassword);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        toast.error(error.response.data.data?.message[language]);
      }
    },
  });

  const resendOtp = async (sentBy) => {
    const verificationEmail = localStorage.getItem("email");
    const lang = localStorage.getItem("language");
    const payload = {
      email: verificationEmail,
      lang,
      sent: sentBy,
    };
    const forgotInfo = {
      email: verificationEmail,
      lang,
    };
    if (!forgotOtp) {
      try {
        const response = await resendVerifyUser(payload);
        if (response.code == 200) {
          toast.success(sent_successfully);
          setTimer(60);
          setIsResendDisabled(true);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error(verification_failed);
      }
    } else {
      try {
        const response = await forgotPassword(forgotInfo);
        if (response.code == 200) {
          setTimer(60);
          setIsResendDisabled(true);
          toast.success(email_sent_successfully);
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    }
  };

  const formatEmail = (email) => {
    if (!email) {
      return "";
    }
    const [localPart, domain] = email.split("@");
    const maskedLocalPart =
      localPart.slice(0, 2) + "*****" + localPart.slice(-2);
    return `${maskedLocalPart}@${domain}`;
  };

  useEffect(() => {
    const verificationEmail = localStorage.getItem("email");
    setVerifyEmail(formatEmail(verificationEmail));
  });

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const {
    reset_password_title,
    reset_password_text,
    reset_email,
    no_recieve,
    resend,
    new_password,
    confirm_new_password,
    enter_new_password,
    enter_new_confirm_password,
    save_changes,
    back_to_login,
    characters_long,
    password_successfully,
  } = t("reset_password");

  const { sent_successfully, verification_failed } = t("verification");
  const { email_sent_successfully } = t("formField");

  return (
    <>
      <title>Reset Password - Resident Review</title>
      <Banner content="Reset Password" />
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section">
            <div>
              <h2>{reset_password_title}</h2>
              <p>{reset_password_text}</p>
              <form onSubmit={formik.handleSubmit}>
                <div className="otp-outer">
                  <p>
                    <MdMailOutline className="position-static" />
                    {reset_email} {verifyEmail}.
                  </p>
                  <div className="otp-field d-flex align-items-center justify-content-center">
                    {emailOtp.map((digit, index) => (
                      <input
                        key={index}
                        type="tel"
                        id={`email-otp-${index}`}
                        maxLength={1}
                        className="form-control"
                        value={digit}
                        onChange={(e) => handleChange(e, index, "email")}
                        onKeyDown={(e) => handleKeyDown(e, index, "email")}
                        onPaste={(e) => handlePaste(e, index)}
                      />
                    ))}
                  </div>
                  {!otpComplete && requiredOtp && (
                    <div className="text-center text-danger">
                      <span>{t("verification.before_submitting")}</span>
                    </div>
                  )}
                  <p className="text-center">
                    {no_recieve}
                    {isResendDisabled ? (
                      <span className="highlight-text red-text">{resend}</span>
                    ) : (
                      <Link
                        to=""
                        title={resend}
                        className="highlight-text"
                        onClick={() => resendOtp("email")}
                      >
                        {resend}
                      </Link>
                    )}
                  </p>
                  {isResendDisabled && (
                    <p className="text-center">
                      {Math.floor(timer / 60)}:
                      {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="form-label">
                    {new_password}
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
                      placeholder={enter_new_password}
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
                    <p>{characters_long}</p>
                  </div>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    {confirm_new_password}
                  </label>
                  <div className="position-relative">
                    <MdLockOutline />
                    <input
                      type={confPasswordShown ? "text" : "password"}
                      id="confirmpassword"
                      name="confirmpassword"
                      value={formik.values.confirmpassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={enter_new_confirm_password}
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
                  <div className="guidelines">
                    <span className="me-1 astrik-symbol">*</span>
                    <p>{characters_long}</p>
                  </div>
                  {formik.touched.confirmpassword &&
                  formik.errors.confirmpassword ? (
                    <div className="error">{formik.errors.confirmpassword}</div>
                  ) : null}
                </div>
                <button
                  type="submit"
                  title={save_changes}
                  className="button w-100"
                >
                  {save_changes}
                </button>
                <p className="text-center">
                  <Link
                    to="/login"
                    title={back_to_login}
                    className="highlight-text login-back"
                  >
                    <MdArrowBack />
                    <span>{back_to_login}</span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <div className="login-background"></div>
        </div>
      </section>
      <ChangedPasswordModal />
    </>
  );
};
