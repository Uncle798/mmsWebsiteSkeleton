/* eslint-disable @typescript-eslint/ban-ts-comment */
import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
//@ts-ignore:
import type { PageServerLoad, Actions } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const invoiceId = event.url.searchParams.get('invoiceId');
   const contactInfoId = event.url.searchParams.get('contactInfoId');
   if(invoiceId){
      const invoice = await prisma.invoice.findUnique({
         where: {
            invoiceId
         }
      })
      if(contactInfoId){
         const address = await prisma.contactInfo.findUnique({
            where: {
               contactId: contactInfoId,
            }
         })
         return { invoice, address };
      }
   }
});

export const actions:Actions = {
   default: async (event) => {
      console.log('payDeposit actions')
      redirect(302, '/newLease/leaseSent');
   }
}