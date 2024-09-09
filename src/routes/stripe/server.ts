import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from './types';

export const POST:RequestHandler = async ({request}) => {
   const body = request.text();
   const signature = request.headers.get('stripe-signature');
   let event;
   try {
      event = stripe.webhooks.constructEvent(body, signature, );
   }
   return new Response();
}