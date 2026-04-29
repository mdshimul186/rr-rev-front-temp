export const BrandReviewBadge = ({
  className = "",
  tone = "filled",
  size = 28,
}) => {
  const style = {
    "--brand-review-size": `${size}px`,
  };

  return (
    <span
      className={`brand-review-badge brand-review-badge--${tone} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <svg viewBox="0 0 74 68" role="presentation" focusable="false">
        <path
          className="brand-review-badge-shape"
          d="M8 30.5L37 8l29 22.5V60H8V30.5Z"
        />
        <path
          className="brand-review-badge-star"
          d="M37 20.5l4.96 10.03 11.07 1.61-8.01 7.81 1.89 11.03L37 45.77l-9.91 5.21 1.89-11.03-8.01-7.81 11.07-1.61L37 20.5Z"
        />
      </svg>
    </span>
  );
};

export const BrandReviewPin = ({
  className = "",
  size = 52,
  tone = "filled",
  glow = true,
  style,
}) => {
  const pinStyle = {
    "--brand-pin-size": `${size}px`,
    ...style,
  };

  return (
    <span
      className={[
        "brand-review-pin",
        glow ? "brand-review-pin--glow" : "",
        `brand-review-pin--${tone}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={pinStyle}
      aria-hidden="true"
    >
      <span className="brand-review-pin-body">
        <BrandReviewBadge tone={tone} size={size * 0.7} />
      </span>
      <span className="brand-review-pin-tail" />
    </span>
  );
};

export const BrandReviewRating = ({
  className = "",
  value = 5,
  total = 5,
  size = 28,
}) => {
  const activeCount = Math.max(0, Math.min(total, Math.round(value)));

  return (
    <div className={`brand-review-rating ${className}`.trim()} aria-label={`${activeCount} out of ${total} review marks`}>
      {Array.from({ length: total }, (_, index) => (
        <BrandReviewBadge
          key={`${size}-${index}`}
          tone={index < activeCount ? "filled" : "muted"}
          size={size}
        />
      ))}
    </div>
  );
};
