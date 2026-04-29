import { useEffect } from "react";
import { useSelector } from "react-redux";
import GlobeDemo from "../../components/GlobeDemo";
import crmIcon from "../../assets/images/crm-icon.svg";
import marketIcon from "../../assets/images/Market.svg";
import financialIcon from "../../assets/images/financial_planning.svg";
import riskIcon from "../../assets/images/risk_management.svg";
import customerIcon from "../../assets/images/customer_testimonial.svg";
import globalIcon from "../../assets/images/Global_Business.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import $ from "jquery";
import "slick-carousel";
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import about_us from "../../assets/images/about_us.png";
import { testimonial } from "../../config/testiMonial.json";


export const Home = () => {
  const t = useOutletContext();
  useSelector((state) => state.auth.isAuthenticated);
  const testimonials = [
    {
      _id: 0,
      testimonialContent: `This platform offers amazing value for the price. The range of features included in the basic package is impressive, and it has significantly boosted our productivity. I feel like I'm getting great value for my investment, and I wouldn't hesitate to recommend it to anyone looking to review their customers and see all of it in one place.`,
      name: "Michael Wilkes",
      designation: "Owner / MLW Painters",
      rating: 5,
    },
    {
      _id: 1,
      testimonialContent: `As a business owner, understanding my customers is crucial, and this has been a game-changer in that regard. The customer review feature is incredibly insightful, allowing me to gather valuable feedback effortlessly. The analytics tools help me identify trends and areas for improvement, ensuring that I can address any issues quickly and effectively.`,
      name: "Sarah Johnson",
      designation: "Owner / Johnson HVAC",
      rating: 5,
    },
    {
      _id: 2,
      testimonialContent: `I've been using this platform for over a month now, and it has consistently exceeded my expectations. The functionality is top-notch, with a clean and intuitive design that makes it easy to navigate. The developers clearly prioritize user experience, and I appreciate the seamless integration with other tools I use. Highly`,
      name: "Kevin Williams",
      designation: "Project Manager",
      rating: 4,
    },
  ];

  useEffect(() => {
    const $slider = $(".testimonial-slider");
    $slider.slick({
      autoplay: true,
      autoplaySpeed: 3000,
      speed: 800,
      draggable: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      pauseOnHover: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 2000,
          },
        },
      ],
    });
  }, []);

  return (
    <>
      <title>Home - Resident Review</title>
      <main className="main-container landing-dark-theme">
        <GlobeDemo />

        <section className="read-more-section landing-section-dark">
          <div className="container">
            <div className="read-more-content">
              <div className="left-content">
                <img src={about_us} alt="About Resident Review" />
              </div>
              <div className="right-content">
                <div className="content-heading">
                  <h6 className="section-brand-pill" style={{ color: '#ffffff' }}>
                    <span>{t("home.get_to_know")}</span>
                  </h6>
                </div>
                <h2 className="landing-section-title" style={{ color: '#ffffff' }}>
                  <span className="text-gradient-blue-orange">{t("home.empowering_businesses")} {t("home.actionable_insights")}</span>
                </h2>
                <div className="right-content-text landing-text-light">
                  <p>{t("home.resident_review_allows")}</p>
                  <p>{t("home.resident_review_prioritizes")}</p>
                </div>
                <div className="mt-4 d-flex gap-3 flex-wrap">
                  <a href="/about" className="btn btn-hero btn-hero-primary">
                    {t("home.learn_more")} <i className="fa-solid fa-arrow-right ms-2"></i>
                  </a>
                  <a href="/contact" className="btn btn-hero btn-hero-secondary">
                    <i className="fa-solid fa-phone me-2"></i> {t("home.contact_us")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Property Resident Assessment Card Section */}
        <section className="assessment-card-section landing-section-dark">
          <div className="container">
            <div className="read-more-content">
              <div className="left-content">
                <div className="assessment-card-wrapper">
                  <div className="assessment-card assessment-card-blue-outline">
                    <div className="assessment-card-header">
                      <span className="assessment-card-badge">{t("home.property_data")}</span>
                      <span className="assessment-card-tag">{t("home.single_family")}</span>
                    </div>
                    <div className="assessment-card-body">
                      <div className="assessment-data-grid">
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.home_equity")}</span>
                          <span className="data-value">$1...</span>
                          <span className="data-status excellent">{t("home.excellent")}</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.property_value")}</span>
                          <span className="data-value">$609K</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.year_built")}</span>
                          <span className="data-value">1964</span>
                          <span className="data-status">62 YRS</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.beds_baths")}</span>
                          <span className="data-value">5 Bed / 1 Bath</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.sq_footage")}</span>
                          <span className="data-value">1,204 sq ft</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.est_value")}</span>
                          <span className="data-value">$609,204</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.heating")}</span>
                          <span className="data-value">{t("home.forced_air")}</span>
                        </div>
                        <div className="assessment-data-item">
                          <span className="data-label">{t("home.cooling")}</span>
                          <span className="data-value">{t("home.central")}</span>
                        </div>
                        <div className="assessment-data-item full-width">
                          <span className="data-label">{t("home.flooring")}</span>
                          <span className="data-value">{t("home.hardwood")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="assessment-card-title">
                      <span className="text-gradient-blue-orange">{t("home.resident_assessment_card_property")}</span>
                    </div>
                  </div>
                  {/* Blue accent line */}
                  <div className="assessment-accent-line assessment-accent-line-blue" />
                </div>
              </div>
              <div className="right-content">
                <div className="content-heading">
                  <h6 className="section-brand-pill" style={{ color: '#ffffff' }}>
                    <span>{t("home.resident_assessment_card_property")}</span>
                  </h6>
                </div>
                <h2 className="landing-section-title" style={{ color: '#ffffff', marginTop: '20px' }}>
                  <span className="text-gradient-blue-orange">{t("home.kyc_reversed")}</span>
                </h2>
                <div className="right-content-text landing-text-light">
                  <p>{t("home.resident_review_property_data")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="business-service-section landing-section-dark">
          <div className="container">
            <div className="business-service-content">
              <div className="service-heading d-flex align-items-center flex-column gap-3 text-center">
                <h6 className="section-brand-pill section-brand-pill--center">
                  <span>{t("home.who_we_are")}</span>
                </h6>
                <h1 className="custom-heading platform-services-title">
                  <span className="resident-review-accent">Resident Review</span> {t("home.platform_services")}
                </h1>
                <p className="service-section-description">
                  {t("home.service_description")}
                </p>
              </div>
              <div className="business-service-cards mt-5">
                <div className="row gy-4">
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={crmIcon} alt="CRM" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.built_in_crm")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.import_and_keep")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={financialIcon} alt="Marketing" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.marketing_opportunities")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.market_directly")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={riskIcon} alt="Risk Management" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.risk_management")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.local_business_owners")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={customerIcon} alt="Customer Reviews" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.customer_reviews")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.platform_empowers")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={marketIcon} alt="Marketplace" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.marketplace_platforms")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.marketplace_platforms_review")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="service-card h-100">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="card-img">
                            <img src={globalIcon} alt="Verification" />
                          </div>
                          <div className="card-heading">
                            <h6>{t("home.business_verification")}</h6>
                          </div>
                          <div className="card-text">
                            <p>{t("home.business_verification_platform")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="textimonial-section landing-section-dark residential-review-section">
          <div className="container">
            <div className="textimonial-content">
              <div className="testimonial-heading d-flex align-items-center flex-column gap-3">
                <h6 className="section-brand-pill section-brand-pill--dark section-brand-pill--center">
                  <span>{t("home.testimonials") || "Testimonials"}</span>
                </h6>
                <h1 className="custom-heading residential-review-title">
                  {t("home.what_customer_say")}
                </h1>
                <p className="residential-review-subtitle">
                  {t("home.testimonials_subtitle")}
                </p>
              </div>

              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                loop={true}
                speed={800}
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                observer={true}
                observeParents={true}
                className="p-4 mt-3 testimonial-swiper"
                breakpoints={{
                  576: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                  },
                  992: {
                    slidesPerView: 3,
                    spaceBetween: 32,
                  },
                }}
              >
                {testimonials.map((data) => {
                  return (
                    <SwiperSlide key={data._id} style={{ height: 'auto' }}>
                      <div className="testimonial_box h-100 testimonial-dark-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '320px' }}>
                        <div className="testimonial_box-inner" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <div className="testimonial-rating-stars">
                            {Array.from({ length: 5 }, (_, i) => (
                              <i key={i} className={`fa-solid fa-star ${i < data.rating ? 'text-warning' : 'text-secondary'}`} style={{ fontSize: '14px', marginRight: '2px' }}></i>
                            ))}
                          </div>
                          <div className="testimonial_box-text" style={{ flexGrow: 1, marginBottom: '30px' }}>
                            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem', fontStyle: 'italic', fontWeight: '400', lineHeight: '1.8', margin: 0 }}>
                              " {data.testimonialContent} "
                            </p>
                          </div>
                          <div className="testimonial_box-name mt-auto" style={{ paddingTop: '20px' }}>
                            <h4 style={{ color: '#ffffff', fontSize: '1.125rem', fontWeight: '700', margin: '0 0 4px 0' }}>{data.name}</h4>
                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', margin: '0' }}>{data.designation}</p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </section>
        
        <section className="cta-section py-5" style={{ background: 'linear-gradient(135deg, #0E83DB 0%, #010F31 100%)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 30% 50%, rgba(255, 104, 51, 0.15) 0%, transparent 50%)' }}></div>
          <div className="container position-relative" style={{ zIndex: 1 }}>
            <div className="row align-items-center">
              <div className="col-lg-8 text-center text-lg-start mb-4 mb-lg-0">
                <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: '700', marginBottom: '1rem' }}>
                  {t("home.ready_transform")}
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', margin: 0 }}>
                  {t("home.join_thousands")}
                </p>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                <a href="/register" className="btn btn-hero btn-hero-primary me-3 mb-2">
                  <i className="fa-solid fa-user-plus me-2"></i>{t("home.get_started_free")}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
