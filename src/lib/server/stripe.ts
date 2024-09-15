import Stripe from "stripe";
import { STRIPE_SECRET_TEST } from '$env/static/private'

export const stripe = new Stripe(STRIPE_SECRET_TEST,{
   typescript:true,
});