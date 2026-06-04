// Stripe integration placeholder — configure with env vars when deploying
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export async function createPaymentIntent(amount: number, bookingId: string) {
  console.log('Creating payment intent for', amount, bookingId);
  return { clientSecret: 'placeholder_secret' };
}
