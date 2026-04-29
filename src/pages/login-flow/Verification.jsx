import {
  Link,
  useOutletContext,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Banner } from "../../components/UI/Banner";
import { MdMailOutline, MdOutlineMessage } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import {
  verifyUser,
  resendVerifyUser,
  getUserDetails,
} from "../../services/user";
import { toast } from "react-toastify";
import { clearToken, setToken } from "../../slices/authSlice";
import { useDispatch } from "react-redux";
import { getUsersData } from "../../slices/userSlice";

export const Verification = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verificationSentOtp = location.state;
  const t = useOutletContext();
  const {
    verification_text,
    enter_code,
    verify_mobile,
    verify_email,
    no_recieve,
    resend,
    continue_text,
  } = t("verification");

  const [emailOtp, setEmailOtp] = useState(new Array(6).fill(""));
  const [mobileOtp, setMobileOtp] = useState(new Array(6).fill(""));
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyContact, setVerifyContact] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [emailTimer, setEmailTimer] = useState(60);
  const [isResendEmailDisabled, setIsResendEmailDisabled] = useState(true);
  const apiCalledRef = useRef(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const language = localStorage.getItem("language") || "eng";

  const handlePaste = (e, type) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      if (type === "email") {
        setEmailOtp(pastedData.split(""));
      } else {
        setMobileOtp(pastedData.split(""));
      }
    }
  };

  const handleChange = (e, index, type) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      if (type === "email") {
        const newEmailOtp = [...emailOtp];
        newEmailOtp[index] = value;
        setEmailOtp(newEmailOtp);
        setEmailError(!newEmailOtp.every((digit) => digit !== ""));
        if (value && index < 5) {
          document.getElementById(`email-otp-${index + 1}`).focus();
        }
      } else {
        const newMobileOtp = [...mobileOtp];
        newMobileOtp[index] = value;
        setMobileOtp(newMobileOtp);
        setMobileError(!newMobileOtp.every((digit) => digit !== ""));
        if (value && index < 5) {
          document.getElementById(`mobile-otp-${index + 1}`).focus();
        }
      }
    }
  };

  const handleKeyDown = (e, index, type) => {
    if (e.key === "Backspace") {
      if (type === "email") {
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
      } else {
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
    }
  };

  const resetForm = () => {
    setEmailOtp(new Array(6).fill(""));
    setMobileOtp(new Array(6).fill(""));
  };

  const getUserDetail = async () => {
    const userDetailsData = await getUserDetails();
    if (userDetailsData.user.user_role === "employee") {
      localStorage.setItem("isRegistered", true);
      navigate("/app/dashboard");
    }
    if (
      userDetailsData.user.user_role !== "employee" &&
      userDetailsData.business_details.length === 0
    ) {
      localStorage.setItem("isRegistered", false);
      navigate("/registration");
    } else {
      localStorage.setItem("isRegistered", true);
      dispatch(getUsersData(userDetailsData));
      setTimeout(() => {
        navigate("/app/dashboard");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobileOtp.includes("")) return setMobileError(true);
    if (emailOtp.includes("")) return setEmailError(true);
    const verificationEmail = localStorage.getItem("email");
    const email = verificationEmail;
    const otp = emailOtp.join("");
    const mobOtp = mobileOtp.join("");
    const payload = {
      email,
      otp,
      mobOtp,
    };
    try {
      const response = await verifyUser(payload);
      if (response.data.statusCode == 200) {
        const { token, tokenExpiry } = response.data.accessToken;
        const expiryTimestamp = Date.now() + parseInt(tokenExpiry) * 60000;
        dispatch(setToken({ token, tokenExpiry: expiryTimestamp }));
        localStorage.setItem("tokenExpiry", expiryTimestamp);
        resetForm();
        getUserDetail();
        setLogoutTimer(parseInt(tokenExpiry));
        localStorage.removeItem("contact");
        navigate("/registration");
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

  const resendOtp = async (sentBy) => {
    const verificationEmail = localStorage.getItem("email");
    const lang = localStorage.getItem("language");
    const payload = {
      email: verificationEmail,
      lang,
      sent: sentBy,
    };
    try {
      const response = await resendVerifyUser(payload);
      console.log("response", response);

      if (response.success) {
        toast.success(response.data[language]);
        if (sentBy === "mob") {
          setTimer(60);
          setIsResendDisabled(true);
          setMobileOtp(new Array(6).fill(""));
        }
        if (sentBy === "email") {
          setEmailTimer(60);
          setIsResendEmailDisabled(true);
          setEmailOtp(new Array(6).fill(""));
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(error.response.data.data.message[language]);
    }
  };

  const formatContact = (contact) => {
    if (!contact) {
      return "";
    }
    const maskedLocalPart = contact.slice(0, 3) + "*****" + contact.slice(-2);
    return `${maskedLocalPart}`;
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
    const verificationContact = localStorage.getItem("contact");
    setVerifyEmail(formatEmail(verificationEmail));
    setVerifyContact(formatContact(verificationContact));
    if (verificationSentOtp && !apiCalledRef.current) {
      resendOtp("both");
      apiCalledRef.current = true;
    }
  }, [verificationSentOtp]);

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

  useEffect(() => {
    let interval;
    if (isResendEmailDisabled) {
      interval = setInterval(() => {
        setEmailTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendEmailDisabled(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendEmailDisabled]);

  return (
    <>
      <title>Verification</title>
      <Banner content={verification_text} />
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section">
            <h2 className="global-heading">{verification_text}</h2>
            <p className="otp-space">{enter_code}</p>
            <form onSubmit={handleSubmit}>
              <div className="otp-outer">
                <p>
                  <MdOutlineMessage className="position-static" />{" "}
                  {verify_mobile} {verifyContact}.
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
                      onChange={(e) => handleChange(e, index, "mobile")}
                      onKeyDown={(e) => handleKeyDown(e, index, "mobile")}
                      onPaste={(e) => handlePaste(e, "mobile")}
                    />
                  ))}
                </div>
                {mobileError && (
                  <div className="text-center text-danger">
                    <span>{t("verification.before_submitting")}</span>
                  </div>
                )}
                <p className="d-flex align-items-center gap-2 justify-content-center">
                  {no_recieve}
                  {isResendDisabled && <p>{t("verification.resend_in")} </p>}
                  {!isResendDisabled && (
                    <Link
                      to=""
                      title={resend}
                      className="highlight-text"
                      onClick={() => resendOtp("mob")}
                    >
                      {resend}
                    </Link>
                  )}
                  {isResendDisabled && (
                    <p className="text-center">
                      {Math.floor(timer / 60)}:
                      {timer % 60 < 10 ? `0${timer % 60}` : timer % 60}{" "}
                      {t("verification.sec")}
                    </p>
                  )}
                </p>
              </div>
              <div className="otp-outer">
                <p>
                  <MdMailOutline className="position-static" />
                  {verify_email}
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
                      onPaste={(e) => handlePaste(e, "email")}
                    />
                  ))}
                </div>
                {emailError && (
                  <div className="text-center text-danger">
                    <span>{t("verification.before_submitting")}</span>
                  </div>
                )}
                <p className="d-flex align-items-center gap-2 justify-content-center">
                  {no_recieve}
                  {isResendEmailDisabled && (
                    <p>{t("verification.resend_in")} </p>
                  )}
                  {!isResendEmailDisabled && (
                    <Link
                      to=""
                      title={resend}
                      className="highlight-text"
                      onClick={() => resendOtp("email")}
                    >
                      {resend}
                    </Link>
                  )}
                  {isResendEmailDisabled && (
                    <p className="text-center">
                      {Math.floor(emailTimer / 60)}:
                      {emailTimer % 60 < 10
                        ? `0${emailTimer % 60}`
                        : emailTimer % 60}{" "}
                      {t("verification.sec")}
                    </p>
                  )}
                </p>
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
        </div>
      </section>
    </>
  );
};
