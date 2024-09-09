import { stripe } from '$lib/server/stripe';
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
   const body = await event.request.json();
   if(body.price){
      const paymentIntent = await stripe.paymentIntents.create({
         amount:Number(body.price),
         currency:'usd',
         automatic_payment_methods: {
            enabled: true,
         }
      })
      return json({
        clientSecret: paymentIntent.client_secret
      });
   }
};