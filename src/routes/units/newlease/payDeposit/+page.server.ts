/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { stripe } from '$lib/server/stripe';
import { anvilClient, getOrganizationalPacketVariables, getPersonalPacketVariables } from "$lib/server/anvil";
//@ts-ignore:
import type { PageServerLoad, Actions } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const invoiceId = event.url.searchParams.get('invoiceId');
   if(invoiceId){
      const invoice = await prisma.invoice.findUnique({
         where: {
            invoiceId
         }
      })
      return { invoice };
   }
});

export const actions:Actions = {
   default: async (event) => {
      const invoiceId = event.url.searchParams.get('invoiceId');
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
            const customer = await prisma.user.findUnique({
               where:{
                  id: invoice?.customerId 
               }
            })
            const unit = await prisma.unit.findUnique({
               where:{
                  num: invoice?.unitNum,
               }
            });
            const employee = await prisma.user.findFirst({
               where: {
                  admin:true
               }
            })
            let variables ={};
            if(customer?.organizationName){
               variables = getOrganizationalPacketVariables( customer!, lease!, unit!, employee! );
            } else {
               variables = getPersonalPacketVariables( customer!, lease!, unit!, employee! );
            }
            const { data, errors } = await anvilClient.createEtchPacket({
               variables
            })
            if (errors) {
               // Note: because of the nature of GraphQL, statusCode may be a 200 even when
               // there are errors.
               console.log('There were errors!')
               console.log(JSON.stringify(errors, null, 2))
            } else {
               const packetDetails = data?.data['createEtchPacket']
               console.log('Visit the new packet on your dashboard:', packetDetails.detailsURL)
               console.log(JSON.stringify(packetDetails, null, 2))
            }
         }
      }
   }
}