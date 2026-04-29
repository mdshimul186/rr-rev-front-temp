import { Outlet } from "react-router-dom";
import { Header } from "../UI/Header";
import { Footer } from "../UI/Footer";
import { useTranslation } from "react-i18next";

/**
 * AppLayout Component
 *
 * This component serves as the main layout for the application,
 * rendering the Header, Footer, and dynamic content using React Router's Outlet.
 *
 * @component
 * @returns {JSX.Element} The layout structure with a header, outlet, and footer.
 */
export const AppLayout = () => {
  const { t } = useTranslation();
  return (
    <>
      <Header t={t} />
      <Outlet context={t} />
      <Footer t={t} />
    </>
  );
};
