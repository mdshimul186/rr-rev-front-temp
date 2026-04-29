import { Rating } from "react-simple-star-rating";

export const ReviewStarRating = ({ size, mode, averageRating }) => {
  const validAverageRating = Math.max(0, Math.min(5, averageRating));

  return (
    <Rating
      size={size}
      fillColor="#FF6833"
      emptyColor="rgba(0, 0, 0, 0.25)"
      readonly={mode}
      initialValue={validAverageRating}
      transition
      allowFraction={true}
    />
  );
};