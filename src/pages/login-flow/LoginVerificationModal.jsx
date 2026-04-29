import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { MdMailOutline } from "react-icons/md";
import {
  getUserDetails,
  sendEmailVerify,
  twoVerificationLogin,
  twoVerificationLoginResend,
} from "../../services/user";
import { setToken, clearToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { getUsersData } from "../../slices/userSlice";

/**
 * LoginVerificationModal component handles the mobile OTP verification process for user login.
 * It allows users to enter the OTP sent to their mobile and provides functionality to resend the OTP.
 *
 * @returns {JSX.Element} The rendered login verification component.
 */
export const LoginVerificationModal = () => {
  const t = useOutletContext();
  const verificationToken = localStorage.getItem("verificationToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
  const [verifyContact, setVerifyContact] = useState("");
  const [requiredOtp, setRequiredOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpComplete, setOtpComplete] = useState(false);
  const language = localStorage.getItem("language");

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setMobileOtp(pastedData.split(""));
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newMobileOtp = [...mobileOtp];
      newMobileOtp[index] = value;
      setMobileOtp(newMobileOtp);
      if (newMobileOtp.every((digit) => digit !== "")) {
        setOtpComplete(true);
      } else {
        setOtpComplete(false);
      }
      if (value && index < 5) {
        document.getElementById(`mobile-otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (mobileOtp[index]) {
        const newMobileOtp = [...mobileOtp];
        newMobileOtp[index] = "";
        setMobileOtp(newMobileOtp);
      } else if (index > 0) {
        const newMobileOtp = [...mobileOtp];
        newMobileOtp[index - 1] = "";
        setMobileOtp(newMobileOtp);
        document.getElementById(`mobile-otp-${index - 1}`).focus();
      }
    }
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();

    if (userDetailsData.user.user_role === "employee") {
      localStorage.setItem("isRegistered", true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRequiredOtp("");
    setOtpComplete(false);
    const email = localStorage.getItem("email");
    const otp = mobileOtp.join("");
    const payload = { email, otp, apiToken: verificationToken };

    try {
      const response = await twoVerificationLogin(payload);
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

  const emailVerification = async () => {
    const email = localStorage.getItem("email");
    const payload = {
      email: email,
    };
    await sendEmailVerify(payload);
    navigate("/email-verification-modal");
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
      apiToken: verificationToken,
    };

    try {
      const response = await twoVerificationLoginResend(payload);
      if (response.code === 200) {
        toast.success(sent_successfully);
        setTimer(60);
        setIsResendDisabled(true);
        setMobileOtp(new Array(6).fill(""));
      }
    } catch (error) {
      toast.error(error.response.data.data.message[language]);
    }
  };

  const formatContact = (contact) => {
    if (!contact) return "";
    return `${contact.slice(0, 3)}*****${contact.slice(-2)}`;
  };

  useEffect(() => {
    const verificationContact = localStorage.getItem("contact");
    if (verificationContact) {
      setVerifyContact(formatContact(verificationContact));
    } else {
      console.warn("No contact found in localStorage!");
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
    verification_text_contact,
    enter_code_login,
    verify_mobile,
    no_recieve,
    resend,
    continue_text,
    sent_successfully,
  } = t("verification");

  return (
    <>
      <title>Mobile Verification - Resident Review</title>
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section">
            <h2 className="global-heading">{verification_text_contact}</h2>
            <p className="otp-space">{enter_code_login}</p>
            <form onSubmit={handleSubmit}>
              <div className="otp-outer">
                <p>
                  <MdMailOutline className="position-static" /> {verify_mobile}{" "}
                  {verifyContact}.
                </p>
                <div className="otp-field d-flex align-items-center justify-content-center">
                  {mobileOtp.map((digit, index) => (
                    <input
                      key={index}
                      type="tel"
                      id={`mobile-otp-${index}`}
                      maxLength={1}
                      className="form-control"
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
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
                    <span>{t("verification.resend_in")} </span>
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
                <div className="text-center ">
                  <button
                    type="button"
                    className="btn btn-none"
                    onClick={emailVerification}
                  >
                    <span className="highlight-text">
                      {t("verification.email_verification")}
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
