import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_TOKEN } from "../../config/config";
import { PayPerUserCheckout } from "./PayPerUserCheckout";

/**
 * PPCCheckoutStripe component sets up the Stripe Elements context for the pay-per-click checkout process.
 * It loads the Stripe library and wraps the PayPerUser Checkout component with the Elements provider.
 *
 * @returns {JSX.Element} The rendered pay-per-click checkout component.
 */
const PPCCheckoutStripe = () => {
  const stripePromise = loadStripe(STRIPE_TOKEN);
  return (
    <Elements stripe={stripePromise}>
      <PayPerUserCheckout />
    </Elements>
  );
};

export default PPCCheckoutStripe;
