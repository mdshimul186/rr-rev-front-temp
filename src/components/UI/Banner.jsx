/**
 * Banner component that displays a heading.
 *
 * @param {Object} props - The component props.
 * @param {string} props.content - The text content to display in the banner.
 * @returns {JSX.Element} The rendered banner component.
 */
export const Banner = ({ content }) => {
  return (
    <section className="login-banner text-center">
      <h1>{content}</h1>
    </section>
  );
};
