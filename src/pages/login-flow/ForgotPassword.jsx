import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Banner } from "../../components/UI/Banner";
import { MdMailOutline, MdArrowBack } from "react-icons/md";
import { forgotPassword } from "../../services/user";
import { useFormik } from "formik";
import { forgotPasswordSchema } from "../../schema";
import { toast } from "react-toastify";

/**
 * ForgotPassword component handles the verification for user login to reset the new passwordF.
 * It allows users to enter their credentials.
 * @returns {JSX.Element} The rendered ForgotPassword verification component.
 */

export const ForgotPassword = () => {
  const t = useOutletContext();
  const navigate = useNavigate();
  const language = localStorage.getItem("language");

  const validation = forgotPasswordSchema(t("validations"));
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validation,
    onSubmit: async (values, { resetForm }) => {
      const lang = localStorage.getItem("language");
      const updatedInfo = {
        ...values,
        lang,
      };
      try {
        const response = await forgotPassword(updatedInfo);
        if (response.code == 200) {
          toast.success(email_sent_successfully);
          localStorage.setItem("email", updatedInfo.email);
          resetForm();
          setTimeout(() => {
            navigate("/reset-password", { state: "forgotPassword" });
          }, 2000);
        }
      } catch (error) {
        toast.error(error.response.data.data.message[language]);
      }
    },
  });

  const {
    email,
    enter_email,
    forgot_password,
    no_worries,
    reset_password,
    email_sent_successfully,
  } = t("formField");

  return (
    <>
      <Banner content="Forgot Password" />
      <section className="wrapper">
        <div className="login d-grid bg-white">
          <div className="form-section forgot-section">
            <div>
              <h2 className="global-heading">{forgot_password}</h2>
              <p>{no_worries}</p>
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
                <button
                  type="submit"
                  title="Reset Password"
                  className="button w-100"
                >
                  {reset_password}
                </button>
                <p className="text-center">
                  <Link
                    to="/login"
                    title="Back to login"
                    className="highlight-text login-back"
                  >
                    <MdArrowBack />
                    <span>{t("reset_password.back_to_login")}</span>
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <div className="login-background"></div>
        </div>
      </section>
    </>
  );
};
