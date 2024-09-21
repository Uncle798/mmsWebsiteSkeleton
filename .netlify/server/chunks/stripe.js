import Stripe from "stripe";
const STRIPE_SECRET_TEST = "sk_test_51PlYzAP59R9WWDKHt3nA4bQSLLygTRVLSlGe0LhV0ZUqLJJg8xN3AK2e1ujnjbUkkk9e61Dr6yAr26iyRALVgiKg00xL5ZRpY5";
const STRIPE_SIGNING_SECRET = "whsec_02718633cbfc01c49248ae3aee5a62d67b88ca867af1eb5c29123ef15d123750";
const stripe = new Stripe(STRIPE_SECRET_TEST, {
  typescript: true
});
export {
  STRIPE_SIGNING_SECRET as S,
  stripe as s
};
