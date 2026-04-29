import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { MdMailOutline } from "react-icons/md";
import {
  getUserDetails,
  sendEmailVerify,
  verifyEmailOTP,
} from "../../services/user";
import { setToken, clearToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { getUsersData } from "../../slices/userSlice";

/**
 * EmailVerificationModal component handles the mobile OTP verification process for user login.
 * It allows users to enter the OTP sent to their email and provides functionality to resend the OTP.
 *
 * @returns {JSX.Element} The rendered emailVerificationModal verification component.
 */
export const EmailVerificationModal = () => {
  const t = useOutletContext();
  const verificationToken = localStorage.getItem("verificationToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [verifyEmail, setVerifyEmail] = useState("");
  const [requiredOtp, setRequiredOtp] = useState("");
  const [otpComplete, setOtpComplete] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const language = localStorage.getItem("language");

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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setEmailOtp(pastedData.split(""));
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

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();

    if (userDetailsData.user.user_role === "employee") {
      setTimeout(() => navigate("/app/dashboard"), 2000);
    } else if (userDetailsData.business_details.length === 0) {
      localStorage.setItem("isRegistered", false);
      navigate("/registration");
    } else {
      localStorage.setItem("isRegistered", true);
      dispatch(getUsersData(userDetailsData));
      setTimeout(() => navigate("/app/dashboard"), 2000);
    }
  };

  const handlePhoneVerify = () => {
    navigate("/verification-modal");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRequiredOtp("");
    setOtpComplete(false);
    const email = localStorage.getItem("email");
    const otp = emailOtp.join("");
    const payload = {
      email,
      otp,
      apiToken: verificationToken,
      type: "email",
    };

    try {
      const response = await verifyEmailOTP(payload);

      if (response.data.success) {
        const { token, tokenExpiry } = response.data.accessToken;
        const expiryTimestamp = Date.now() + parseInt(tokenExpiry) * 60000;
        dispatch(setToken({ token, tokenExpiry: expiryTimestamp }));
        localStorage.setItem("tokenExpiry", expiryTimestamp);
        getUserDetail();
        setLogoutTimer(parseInt(tokenExpiry));
        localStorage.removeItem("verificationToken");
      }
    } catch (error) {
      toast.error(error.response.data.data.message[language]);
    }
  };

  const setLogoutTimer = (expiryMinutes) => {
    const expiryMs = expiryMinutes * 60000;
    clearTimeout(window.logoutTimer);
    window.logoutTimer = setTimeout(() => {
      handleLogout();
    }, expiryMs);
  };

  const handleLogout = () => {
    dispatch(clearToken());
    window.location.href = "/login";
  };

  const resendOtp = async () => {
    const verificationEmail = localStorage.getItem("email");
    const lang = localStorage.getItem("language");
    const payload = {
      email: verificationEmail,
      lang,
    };

    try {
      const response = await sendEmailVerify(payload);
      if (response.data.success) {
        toast.success(response.data.message[language]);
        setTimer(60);
        setIsResendDisabled(true);
        setEmailOtp(new Array(6).fill(""));
      }
    } catch (error) {
      toast.error(error.response.data.data.message[language]);
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
    if (verificationEmail) {
      setVerifyEmail(formatEmail(verificationEmail));
    } else {
      console.error("No contact found in localStorage!");
    }
  }, []);

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
    verification_email,
    enter_code_email,
    verify_email,
    no_recieve,
    resend,
    continue_text,
  } = t("verification");

  return (
    <>
      <title>Email Verification - Resident Review</title>
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section">
            <h2 className="global-heading">{verification_email}</h2>
            <p className="otp-space">{enter_code_email}</p>
            <form onSubmit={handleSubmit}>
              <div className="otp-outer">
                <p>
                  <MdMailOutline className="position-static" /> {verify_email}{" "}
                  {verifyEmail}.
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
                      onPaste={(e) => handlePaste(e, "email")} // Paste event
                    />
                  ))}
                </div>
                {!otpComplete && requiredOtp && (
                  <div className="text-center text-danger">
                    <span>{t("verification.before_submitting")}</span>
                  </div>
                )}
                <p className="d-flex align-items-center gap-2 justify-content-center">
                  {no_recieve}
                  {isResendDisabled && (
                    <span>{t("verification.resend_in")}</span>
                  )}
                  {!isResendDisabled && (
                    <Link
                      to=""
                      title={resend}
                      className="highlight-text"
                      onClick={resendOtp}
                    >
                      {resend}
                    </Link>
                  )}
                  {isResendDisabled && (
                    <span className="text-center">
                      {Math.floor(timer / 60)}:
                      {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}{" "}
                      {t("verification.sec")}
                    </span>
                  )}
                </p>
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-none"
                    onClick={handlePhoneVerify}
                  >
                    <span className="highlight-text">
                      {t("verification.phone_verification")}
                    </span>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                title={continue_text}
                className="button d-block w-100 mb-0"
              >
                {continue_text}
              </button>
            </form>
          </div>
          <div className="login-background"></div>
        </div>
      </section>
    </>
  );
};
