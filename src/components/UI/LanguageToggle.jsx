import { useEffect, useState } from "react";
import us from "../../assets/images/us.png";
import spain from "../../assets/images/mexico.png";
import { useTranslation } from "react-i18next";

/**
 * LanguageToggle component allows users to switch between languages (English and Spanish).
 * It saves the selected language preference in local storage and updates the application language accordingly.
 *
 * @returns {JSX.Element} The rendered language toggle component.
 */
export const LanguageToggle = () => {
  const [toggle, setToggle] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      if (savedLanguage === "spn") {
        setToggle(true);
        i18n.changeLanguage("sp");
      } else {
        setToggle(false);
        i18n.changeLanguage("en");
      }
    } else {
      setToggle(false);
      i18n.changeLanguage("en");
      localStorage.setItem("language", "eng");
    }
  }, [i18n]);

  useEffect(() => {
    const newLanguage = toggle ? "spn" : "eng";
    i18n.changeLanguage(toggle ? "sp" : "en");
    localStorage.setItem("language", newLanguage);
  }, [toggle, i18n]);

  const handleToggle = () => {
    setIsAnimating(true);
    setToggle(!toggle);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div 
      className={`lang-toggle-wrapper ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      title={toggle ? "Switch to English" : "Cambiar a Español"}
    >
      <div className={`lang-toggle ${toggle ? "switch" : ""}`}>
        <div className="lang-toggle-flag">
          <img src={toggle ? spain : us} alt={toggle ? "Español" : "English"} />
        </div>
        <span className="lang-toggle-label">{toggle ? "ES" : "EN"}</span>
        <div className="lang-toggle-indicator">
          <div className={`lang-toggle-dot ${toggle ? "right" : "left"}`}></div>
        </div>
      </div>
    </div>
  );
};
