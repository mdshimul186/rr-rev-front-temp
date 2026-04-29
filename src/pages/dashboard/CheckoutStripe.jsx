import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Checkout } from "./Checkout";
import { STRIPE_TOKEN } from "../../config/config";

/**
 * CheckoutStripe component sets up the Stripe Elements context for the checkout process.
 * It loads the Stripe library and wraps the Checkout component with the Elements provider.
 *
 * @returns {JSX.Element} The rendered Stripe checkout component.
 */
const CheckoutStripe = () => {
  const stripePromise = loadStripe(STRIPE_TOKEN);
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutStripe;
