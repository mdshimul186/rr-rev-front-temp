import { Outlet } from "react-router-dom";
import { Dashboardheader } from "../UI/DashboardHeader";
import { SideNavigation } from "../UI/SideNavigation";
import { DashboardFooter } from "../UI/DashboardFooter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * DashboardLayout Component
 * 
 * This component provides the main layout for the dashboard, 
 * including the header, side navigation, footer, and dynamic content via Outlet.
 * 
 * @component
 * @returns {JSX.Element} The structured dashboard layout.
 */
export const DashboardLayout = () => {
  const { t } = useTranslation();
  const [collapse, setCollapse] = useState(false);
  const context = { collapse, t };
  return (
    <>
      <Dashboardheader collapse={collapse} setCollapse={setCollapse} />
      <SideNavigation collapse={collapse} />
      <Outlet context={context} />
      <DashboardFooter collapse={collapse} />
    </>
  );
};
