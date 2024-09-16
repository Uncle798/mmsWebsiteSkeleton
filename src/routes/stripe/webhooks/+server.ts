import { STRIPE_SIGNING_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from './$types'; 

async function handlePaymentIntent(intent) {

}


export const POST: RequestHandler = async (event) => {
   if(STRIPE_SIGNING_SECRET){
      const signature = event.request.headers.get('stripe-signature');
      let stripeEvent;
      if(signature){
         try {
            const body = await event.request.text();
            stripeEvent = stripe.webhooks.constructEvent(
               body, 
               signature, 
               STRIPE_SIGNING_SECRET
            );
         } catch (err) {
            console.error(err);

         }
         switch (stripeEvent?.type) {
            case 'payment_intent.succeeded': {
               const paymentIntent = stripeEvent.data.object;
               console.log('stripe webhooks '+paymentIntent);
               break;
            }
            case 'payment'
            default:
               break;
         }
      }
   }
   return new Response(JSON.stringify('ok'), {status: 200});
};