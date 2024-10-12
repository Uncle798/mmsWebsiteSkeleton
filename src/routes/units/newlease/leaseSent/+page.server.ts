import prisma from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';

import { anvilClient, getOrganizationalPacketVariables, getPersonalPacketVariables } from "$lib/server/anvil";

import type { PageServerLoad } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const invoiceId = event.url.searchParams.get('invoiceId');
   if(invoiceId){
      const invoice = await prisma.invoice.update({
         where: {
            invoiceId,
         },
         data: {
            invoicePaid: new Date,
         }
      })
      const paymentRecord = await prisma.paymentRecord.create({
         data: {
            paymentAmount: invoice.invoiceAmount,
            invoiceId: invoice.invoiceId,
            customerId: invoice.customerId || '',
            paymentType: 'STRIPE'
         }
      })
      const lease = await prisma.lease.findUnique({
         where: {
            leaseId: invoice?.leaseId || '',
         }
      })
      const customer = await prisma.user.findUnique({
         where:{
            id: invoice?.customerId || undefined,
         }
      })
      const unit = await prisma.unit.findUnique({
         where:{
            num: lease?.unitNum,
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
         console.error('There were errors!')
         console.error(JSON.stringify(errors, null, 2));
         console.error(data?.data['createEtchPacket'])
      } else {
         const packetDetails = data?.data['createEtchPacket']
         console.log('Visit the new packet on your dashboard:', packetDetails.detailsURL)
         const anvilEID = packetDetails['eid']
         console.log(anvilEID);
         const updatedLease = await prisma.lease.update({
            where: {
               leaseId: lease?.leaseId
            },
            data: {
               anvilEID 
            }
         })
         return {packetDetails};
      }
   }
});