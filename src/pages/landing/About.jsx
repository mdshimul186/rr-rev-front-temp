import bannerImage from "../../assets/images/banner-map.png";
import about_us from "../../assets/images/about_us.png";
import { useOutletContext } from "react-router-dom";

/**
 * About component displays information about the company and its mission.
 * It includes a banner and a section that provides details about the company.
 *
 * @returns {JSX.Element} The rendered About Us component.
 */
export const About = () => {
  const t = useOutletContext();

  return (
    <>
      <title>About Us - Resident Review</title>
      <main className="main-container">
        <section className="banner-section about-us-banner">
          <div className="banner position-relative">
            <img src={bannerImage} />
            <div className="banner-content">
              <div className="banner-text">
                <h1>{t("home.about_us")}</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="read-more-section">
          <div className="container">
            <div className="read-more-content">
              <div className="row gy-3">
                <div className="col-lg-6">
                  <div className="left-content">
                    <img src={about_us} alt="" />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="right-content">
                    <div className="content-heading">
                      <h6>{t("home.get_to_know")}</h6>
                    </div>
                    <div className="right-content-text">
                      <p>{t("home.business_owner_looking")}</p>
                      <p>{t("home.resident_review_prioritizes")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
