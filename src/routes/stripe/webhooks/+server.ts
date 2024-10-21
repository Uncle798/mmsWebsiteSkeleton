import { STRIPE_SIGNING_SECRET } from '$env/static/private';
import { stripe } from '$lib/server/stripe';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types'; 


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
            case 'payment_intent.created': {
               const paymentIntent = stripeEvent.data.object;
               const handlePaymentIntent = async (intent:typeof paymentIntent)=> {
                  await prisma.paymentRecord.create({
                     data: {
                        invoiceId: intent.metadata.invoiceId,
                        customerId: intent.metadata.customerId,
                        paymentAmount: intent.amount / 100,
                        paymentType: 'STRIPE',
                        paymentId: intent.id,
                        unitNum: intent.metadata.unitNum,
                        payee: intent.metadata.customerId,
                     }
                  })
               }
               handlePaymentIntent(paymentIntent);
               return new Response(JSON.stringify('ok'), {status: 200});
               break;
            }
            case 'payment_intent.succeeded':{
               const paymentIntent = stripeEvent.data.object;
               const handlePaymentIntent = async (intent:typeof paymentIntent)=> {
                  await prisma.paymentRecord.update({
                     where: {
                        paymentId: intent.id,
                     },
                     data: {
                        paymentCompleted: new Date,
                        paymentAmount: intent.amount_received / 100,
                     }
                  })
               }
               handlePaymentIntent(paymentIntent);
               return new Response(JSON.stringify('ok'), {status: 200});
               break;

            }
            default:
               break;
         }
      }
   }
   return new Response(JSON.stringify('ok'), {status: 200});
};