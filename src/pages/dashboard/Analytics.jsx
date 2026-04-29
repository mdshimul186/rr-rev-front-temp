import { useOutletContext } from "react-router-dom";

/**
 * Analytics component displays a section for analytics within the dashboard.
 * It currently shows a message indicating that the analytics feature is coming soon.
 *
 * @returns {JSX.Element} The rendered analytics section.
 */
export const Analytics = () => {
  const { collapse, t } = useOutletContext();

  return (
    <section
      className={`dashboard analytics left-spacing ${collapse ? "expand" : ""}`}
    >
      <h1 className="global-heading">{t("privacyPolicy.analytics")}</h1>
      <div className="analytic-cards d-grid gap-4 grid-four--cols">
        <p className=" fs-3">{t("analyticsPage.coming_soon")}</p>
      </div>
    </section>
  );
};
