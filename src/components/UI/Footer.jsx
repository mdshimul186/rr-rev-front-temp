import { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaRegPaperPlane,
  FaLinkedin,
} from "react-icons/fa";
import {
  MdChevronRight,
  MdMailOutline,
  MdOutlineLocationOn,
  MdSchedule,
} from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { FaXTwitter } from "react-icons/fa6";
import { subscribeCustomer } from "../../services/user";
import { toast } from "react-toastify";
import {
  FACEBOOK_PROFILE_URL,
  TWITTER__URL,
  INSTAGRAM_URL,
  LINKDEDIN_URL,
  RESIDENT_REVIEW_URL,
  REVIEW_MAIL,
} from "../../config/constant";

/**
 * Footer component renders the footer section of the website.
 * It includes company information, quick links, contact details, and a newsletter subscription form.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.t - Translation function for internationalization.
 * @returns {JSX.Element} The rendered footer component.
 */
export const Footer = ({ t }) => {
  const [email, setEmail] = useState("");
  const { about, services, contact } = t("header");

  const {
    email_cannot,
    subscribe_success,
    email_address,
    footer_info,
    quick_links,
    testimonials,
    contact_info,
    address1,
    address2,
    time,
    time_hrs,
    newsletter,
    newsletter_content,
    footer,
    privacy_policy,
    terms_and_condition,
    blog,
  } = t("footer");

  const { enter_email } = t("formField");

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error(email_cannot);
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error(email_address);
      return;
    }

    try {
      const response = await subscribeCustomer(email);
      if (response.success) {
        toast.success(subscribe_success);
        setEmail("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <footer>
        <div className="wrapper spacing d-grid">
          <div>
            <Link to="/" title="Resident Review">
              <img
                src={logo}
                alt="Resident Review"
                width={140}
                height={62.28}
                className="img-fluid logo"
              />
            </Link>
            <p className="footer-content">{footer_info}</p>
            <div className="social-icons d-flex gap-2">
              <Link to={FACEBOOK_PROFILE_URL} target="_blank" title="Facebook">
                <FaFacebookF />
              </Link>
              <Link to={TWITTER__URL} target="_blank" title="Twitter">
                <FaXTwitter />
              </Link>
              <Link to={INSTAGRAM_URL} target="_blank" title="Instagram">
                <FaInstagram />
              </Link>
              <Link to={LINKDEDIN_URL} target="_blank" title="Linkedin">
                <FaLinkedin />
              </Link>
            </div>
          </div>
          <div>
            <p className="foot-heading">{quick_links}</p>
            <ul className="footer-content d-flex flex-column gap-2">
              <li>
                <NavLink to="/about" title={about}>
                  <MdChevronRight className="position-static" />
                  <span>{about}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" title={services}>
                  <MdChevronRight className="position-static" />
                  <span>{services}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/testimonial" title={testimonials}>
                  <MdChevronRight className="position-static" />
                  <span>{testimonials}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" title={contact}>
                  <MdChevronRight className="position-static" />
                  <span>{contact}</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" target="_blank" title={blog}>
                  <MdChevronRight className="position-static" />
                  <span>{blog}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacyPolicy"
                  target="_blank"
                  title={privacy_policy}
                >
                  <MdChevronRight className="position-static" />
                  <span>{privacy_policy}</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/termsAndCondition"
                  target="_blank"
                  title={terms_and_condition}
                >
                  <MdChevronRight className="position-static" />
                  <span>{terms_and_condition}</span>
                </NavLink>
              </li>
            </ul>
          </div>
          <div>
            <p className="foot-heading">{contact_info}</p>
            <ul className="footer-content footer-address d-flex flex-column">
              <li>
                <MdOutlineLocationOn />
                <span>
                  {address1}
                  <br /> {address2}
                </span>
              </li>
              <li>
                <MdMailOutline />
                <span>{REVIEW_MAIL}</span>
              </li>
              <li>
                <MdSchedule />
                <span>
                  {time} <br /> {time_hrs}
                </span>
              </li>
            </ul>
          </div>
          <div>
            <p className="foot-heading">{newsletter}</p>
            <p className="footer-content">{newsletter_content}</p>
            <div className="newsletter d-inline-block position-relative">
              <input
                type="email"
                name="newsletter-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                autoComplete="off"
                placeholder={enter_email}
                required
              />
              <span className="send-icon" onClick={handleSubscribe}>
                <FaRegPaperPlane />
              </span>
            </div>
          </div>
        </div>
        <div className="copyright text-center">
          <p>
            {footer}
            <a
              href={RESIDENT_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="highlight-text">Resident Review</span>
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};
