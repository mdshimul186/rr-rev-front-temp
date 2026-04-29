import { useEffect } from "react";
import bannerImage from "../../assets/images/banner-map.png";
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
import { testimonial } from "../../config/testiMonial.json";
import { BrandReviewRating } from "../../components/UI/BrandReviewIcon";


export const Testimonial = () => {
  const t = useOutletContext();

  const {
    testimonial_1_content,
    testimonial_2_content,
    testimonial_3_content,
    testimonial_4_content,
    designation_1,
    designation_2,
    designation_3,
    designation_4,
  } = t("testimonal");

  const testimonials = [
    {
      _id: 0,
      testimonialContent: testimonial_1_content,
      profileImg: testimonial[0].profileImg,
      name: testimonial[0].name,
      designation: designation_1,
    },
    {
      _id: 1,
      testimonialContent: testimonial_2_content,
      profileImg: testimonial[1].profileImg,
      name: testimonial[1].name,
      designation: designation_2,
    },
    {
      _id: 2,
      testimonialContent: testimonial_3_content,
      profileImg: testimonial[2].profileImg,
      name: testimonial[2].name,
      designation: designation_3,
    },
    {
      _id: 3,
      testimonialContent: testimonial_4_content,
      profileImg: testimonial[3].profileImg,
      name: testimonial[3].name,
      designation: designation_4,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    const $slider = $(".testimonial-slider");
    $slider.slick({
      autoplay: true,
      autoplaySpeed: 1000,
      speed: 600,
      draggable: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
      responsive: [
        {
          breakpoint: 991,
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
          },
        },
      ],
    });
  }, []);

  return (
    <>
      <title>Testimonial - Resident Review</title>
      <main className="main-container">
        <section className="banner-section about-us-banner">
          <div className="banner position-relative">
            <img src={bannerImage} />
            <div className="banner-content">
              <div className="banner-text">
                <h1>{t("footer.testimonials")}</h1>
              </div>
            </div>
          </div>
        </section>
        <section className="textimonial-section">
          <div className="container">
            <div className="textimonial-content">
              <div className="testimonial-heading d-flex align-items-center flex-column gap-3">
                <h1 className="custom-heading">
                  {t("home.what_customer_say")}
                </h1>
              </div>

              <Swiper
                spaceBetween={50}
                slidesPerView={3}
                loop={true}
                speed={800}
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 1000 }}
                className="p-4 mt-3"
              >
                {testimonials.map((data) => {
                  return (
                    <SwiperSlide key={data._id}>
                      <div className="testimonial_box">
                        <div className="testimonial_box-inner">
                          <div className="testimonial_box-top">
                            <div className="testimonial_box-icon">
                              <i className="fa-solid fa-quote-left"></i>
                            </div>
                            <div className="testimonial_box-text">
                              <p>“ {data.testimonialContent}“</p>
                            </div>
                            <div className="testimonial-profile d-flex align-items-center gap-3">
                              <div className="testimonial_box-">
                                <img src={data.profileImg} alt="profile" />
                              </div>
                              <div className="testimonial_box-name">
                                <h4>{data.name}</h4>
                                <p>{data.designation}</p>
                              </div>
                            </div>
                            <div className="rating mt-3">
                              <BrandReviewRating size={22} value={5} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
                ...
              </Swiper>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};
