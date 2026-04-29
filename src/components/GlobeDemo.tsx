"use client";
import React, { lazy, Suspense, useMemo } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

// Using lazy instead of next/dynamic for Vite integration
const World = lazy(() =>
  import("./UI/globe").then((m) => ({ default: m.World }))
);

// RR Logo Icon for CTA button - Matches reference image
const RRLogoIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 52 32"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Blue R letters background */}
    <path
      d="M14 4H22C26 4 28 6 28 10C28 14 26 16 22 16H20V20H14V4ZM20 12H21C22 12 22 11.5 22 10C22 9 22 8 21 8H20V12Z"
      fill="#0E83DB"
    />
    <path
      d="M30 4H38C42 4 44 6 44 10C44 14 42 16 38 16H36V20H30V4ZM36 12H37C38 12 38 11.5 38 10C38 9 38 8 37 8H36V12Z"
      fill="#0E83DB"
    />
    {/* Orange house overlay on first R */}
    <path
      d="M2 28V14L10 6L18 14V28H2Z"
      fill="#FF6833"
    />
    {/* House outline */}
    <path
      d="M2 28V14L10 6L18 14V28H2Z"
      stroke="#FF8C42"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Blue window in house */}
    <rect x="7" y="16" width="6" height="8" fill="#0E83DB" rx="1" />
    {/* Window panes */}
    <line x1="10" y1="16" x2="10" y2="24" stroke="#FF6833" strokeWidth="1" />
    <line x1="7" y1="20" x2="13" y2="20" stroke="#FF6833" strokeWidth="1" />
  </svg>
);

export default function GlobeDemo() {
  const { t } = useTranslation();

  const globeConfig = {
    pointSize: 3,
    globeColor: "#0a1a3a",
    showAtmosphere: true,
    atmosphereColor: "#4a9eff",
    atmosphereAltitude: 0.15,
    emissive: "#0d1f4d",
    emissiveIntensity: 0.15,
    shininess: 1.2,
    polygonColor: "rgba(100,180,255,0.5)",
    ambientLight: "#1e3a5f",
    directionalLeftLight: "#4a9eff",
    directionalTopLight: "#ffffff",
    pointLight: "#ff8c42",
    arcTime: 1200,
    arcLength: 0.85,
    rings: 2,
    maxRings: 4,
    // Start focused on the contiguous United States
    initialPosition: { lat: 39.5, lng: -98.35 },
    autoRotate: true,
    autoRotateSpeed: 0.4,
  };

  const colors = useMemo(() => ["#06b6d4", "#3b82f6", "#6366f1", "#ff6833", "#0e83db"], []);

  // US-focused arcs connecting major American cities - statically generated
  const sampleArcs = useMemo(() => [
    { order: 1, startLat: 40.7128, startLng: -74.006, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.25, color: colors[0] },
    { order: 1, startLat: 41.8781, startLng: -87.6298, endLat: 29.7604, endLng: -95.3698, arcAlt: 0.15, color: colors[1] },
    { order: 2, startLat: 33.4484, startLng: -112.074, endLat: 39.9526, endLng: -75.1652, arcAlt: 0.3, color: colors[2] },
    { order: 2, startLat: 29.4241, startLng: -98.4936, endLat: 32.7157, endLng: -117.1611, arcAlt: 0.15, color: colors[3] },
    { order: 3, startLat: 32.7767, startLng: -96.797, endLat: 37.3382, endLng: -121.8863, arcAlt: 0.25, color: colors[4] },
    { order: 3, startLat: 30.2672, startLng: -97.7431, endLat: 30.3321, endLng: -81.6557, arcAlt: 0.2, color: colors[0] },
    { order: 4, startLat: 37.7749, startLng: -122.4194, endLat: 39.9612, endLng: -82.9988, arcAlt: 0.35, color: colors[1] },
    { order: 4, startLat: 35.2271, startLng: -80.8431, endLat: 32.725, endLng: -97.3208, arcAlt: 0.2, color: colors[2] },
    { order: 5, startLat: 47.6062, startLng: -122.3321, endLat: 39.7392, endLng: -104.9903, arcAlt: 0.15, color: colors[3] },
    { order: 5, startLat: 36.1627, startLng: -86.7816, endLat: 42.3601, endLng: -71.0589, arcAlt: 0.2, color: colors[4] },
    { order: 6, startLat: 25.7617, startLng: -80.1918, endLat: 41.8781, endLng: -87.6298, arcAlt: 0.25, color: colors[0] },
    { order: 6, startLat: 45.5051, startLng: -122.675, endLat: 33.749, endLng: -84.388, arcAlt: 0.35, color: colors[1] },
  ], [colors]);

  // Demo modal handler
  const handleDemoClick = () => {
    window.open('/register', '_blank');
  };

  return (
    <div className="hero-globe-section">
      {/* Background gradient overlay */}
      <div className="hero-globe-bg" />
      
      {/* Tech/Data background with dots and network lines */}
      <div className="hero-tech-background" aria-hidden="true">
        {/* Grid dots */}
        <div className="tech-dots">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`dot-${i}`}
              className="tech-dot"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {/* Network lines */}
        <svg className="tech-network-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.line
            x1="10" y1="20" x2="30" y2="40"
            stroke="rgba(74, 158, 255, 0.15)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.line
            x1="70" y1="10" x2="90" y2="30"
            stroke="rgba(74, 158, 255, 0.12)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
          <motion.line
            x1="20" y1="60" x2="50" y2="80"
            stroke="rgba(255, 140, 66, 0.1)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.line
            x1="60" y1="50" x2="85" y2="70"
            stroke="rgba(74, 158, 255, 0.1)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
          />
          <motion.line
            x1="5" y1="80" x2="25" y2="90"
            stroke="rgba(255, 140, 66, 0.08)"
            strokeWidth="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.8, repeat: Infinity, repeatType: "reverse", delay: 0.8 }}
          />
        </svg>
      </div>

      <div className="hero-globe-inner">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-text-side"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-badge we-review-badge"
          >
            <span className="hero-badge-dot" />
            <span>WE REVIEW!</span>
          </motion.div>

          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {t("hero.review_customers")}
            <span className="hero-headline-accent"> {t("hero.through_business")}</span>
            <br />
            <span className="hero-headline-transition">{t("hero.perspective")}</span>
          </motion.h1>

          <motion.p
            className="hero-subtext"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            className="hero-inline-transition"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <span className="hero-inline-transition-line" />
            <p>{t("home.turning_data")}</p>
          </motion.div>

          {/* Stats row - only US States */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <div className="hero-stat">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">{t('hero.us_states')}</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="hero-cta-row"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <a href="/register" className="hero-btn-primary" id="hero-cta-started">
              <RRLogoIcon className="hero-btn-icon" />
              {t('hero.get_started')}
            </a>
            <button onClick={handleDemoClick} className="hero-btn-secondary" id="hero-cta-demo">
              <i className="fa-solid fa-play" />
              {t('hero.demo')}
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Globe */}
        <motion.div
          className="hero-globe-side"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="hero-globe-canvas-wrapper hero-globe-canvas-wrapper--full">
            <Suspense
              fallback={
                <div className="hero-globe-loading">
                  <div className="hero-globe-spinner" />
                  <span>{t('hero.loading_globe')}</span>
                </div>
              }
            >
              <World data={sampleArcs} globeConfig={globeConfig} />
            </Suspense>

            {/* Dynamic ambient particles */}
            <div className="hero-globe-particles" aria-hidden="true">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="globe-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Dynamic glow rings */}
            <div className="hero-globe-glow-rings" aria-hidden="true">
              <motion.div
                className="glow-ring glow-ring-1"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="glow-ring glow-ring-2"
                animate={{ scale: [1.1, 1.3, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="glow-ring glow-ring-3"
                animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            {/* Clean globe - no static markers */}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="hero-globe-fade-bottom" />
    </div>
  );
}
