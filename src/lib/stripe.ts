import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SCERET_KEY!, {
    typescript: true,
    apiVersion: "2024-10-28.acacia",
  });

export default stripe;
