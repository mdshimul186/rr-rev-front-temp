import { useTranslation } from "react-i18next";
import { RESIDENT_REVIEW_URL } from "../../config/constant";

/**
 * DashboardFooter component display after succesfull user login.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.collapse - State indicating if the sidebar is collapsed.
 * @returns {JSX.Element} The rendered footer for logged in user.
 */
export const DashboardFooter = ({ collapse }) => {
  const { t } = useTranslation();
  return (
    <footer
      className={`left-spacing bg-transparent dashboard-footer text-center ${
        collapse ? "expand" : ""
      }`}
    >
      <a href={RESIDENT_REVIEW_URL} target="_blank">
        <p>
          {t("footer.footer")} <span>Resident Review</span>
        </p>
      </a>
    </footer>
  );
};
