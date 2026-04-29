import { Rating } from "react-simple-star-rating";

/**
 * StarRating component renders a star rating system that allows users to rate an item.
 * It supports both whole and half star ratings based on the provided props.
 *
 * @param {Object} props - The component props.
 * @param {number} props.size - The size of the stars.
 * @param {boolean} props.mode - Indicates if the rating is read-only.
 * @param {number} props.averageRating - The average rating to display.
 * @param {Function} props.handleRating - Function to handle rating changes.
 * @param {string} props.totalRating - Class name for styling the total rating.
 * @param {boolean} props.halfRating - Indicates if half star ratings are allowed.
 * @returns {JSX.Element} The rendered star rating component.
 */
export const StarRating = ({
  size,
  mode,
  averageRating,
  handleRating,
  totalRating,
  halfRating,
}) => {
  if (halfRating) {
    return (
      <Rating
        onClick={handleRating}
        size={size}
        fillColor="#FF6833"
        emptyColor="rgba(0, 0, 0, 0.25)"
        readonly={mode}
        initialValue={averageRating}
        transition
        className={totalRating}
        allowFraction={true}
      />
    );
  } else {
    return (
      <Rating
        onClick={handleRating}
        size={size}
        fillColor="#FF6833"
        emptyColor="rgba(0, 0, 0, 0.25)"
        readonly={mode}
        initialValue={averageRating}
        transition
        className={totalRating}
        allowFraction={false}
      />
    );
  }
};
