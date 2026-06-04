import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

if (!stripePublishableKey) {
  console.warn('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable.');
}

// Singleton Stripe instance
let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey ?? '');
  }
  return stripePromise;
};

export default getStripe;
