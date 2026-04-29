import { useNavigate, useOutletContext } from "react-router-dom";

/**
 * ErrorPage component displays an error message to the user when something goes wrong.
 * It provides options to navigate back to the login page or the home page.
 *
 * @returns {JSX.Element} The rendered error page component.
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const t = useOutletContext();
  return (
    <div className="errorPage">
      <h1>{t("header.something_went")}</h1>
      <p>{t("header.retrieve_your")}</p>

      <button
        className="button"
        onClick={() => navigate("/login")}
        style={{ padding: "10px 20px", margin: "10px", cursor: "pointer" }}
      >
        {t("header.to_login")}
      </button>
      <button
        className="button"
        onClick={() => navigate("/")}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {t("header.to_home")}
      </button>
    </div>
  );
};

export default ErrorPage;
