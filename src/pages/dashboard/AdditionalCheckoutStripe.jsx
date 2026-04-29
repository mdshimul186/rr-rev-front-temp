import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_TOKEN } from "../../config/config";
import { AddUserCheckout } from "./AddUserCheckout";

/**
 * AdditionalCheckoutStripe component sets up the Stripe Elements context for the checkout process.
 * It loads the Stripe library and wraps the AddUser Checkout component with the Elements provider.
 *
 * @returns {JSX.Element} The rendered Stripe checkout component.
 */
const AdditionalCheckoutStripe = () => {
  const stripePromise = loadStripe(STRIPE_TOKEN);
  return (
    <Elements stripe={stripePromise}>
      <AddUserCheckout />
    </Elements>
  );
};

export default AdditionalCheckoutStripe;
