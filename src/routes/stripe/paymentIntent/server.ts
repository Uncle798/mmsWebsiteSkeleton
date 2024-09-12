import { stripe } from '$lib/server/stripe';
import type { RequestHandler } from './types';

export const POST:RequestHandler = async ({request}) => {
   const invoiceId = request.url.searchParams.get('invoiceId');
   if(invoiceId){
      const invoice = await prisma.invoice.findUnique({
         where:{
            invoiceId,
         }
      })
      if(invoice){
         const paymentIntent = await stripe.paymentIntents.create({
            amount: invoice.price,
            currency: 'usd',
            payment_method_types: ['card'],
         })
         return {
            body: {
               clientSecret: paymentIntent.client_secret
            }
         }
      }
   }
}