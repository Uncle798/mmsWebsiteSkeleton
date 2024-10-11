import prisma from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';

import { anvilClient, getOrganizationalPacketVariables, getPersonalPacketVariables } from "$lib/server/anvil";

import type { PageServerLoad } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      redirect(302, '/login')
   }
   const paymentId = event.url.searchParams.get('paymentId');
   if(paymentId){
      const payment = await prisma.paymentRecord.findUnique({
         where:{
            paymentId,
         }
      });
      if(payment?.paymentCompleted){
         const invoice = await prisma.invoice.findUnique({
            where:{
               invoiceId: payment.invoiceId || '',
            }
         });
         const lease = await prisma.lease.findUnique({
            where: {
               leaseId: invoice?.leaseId || '',
            }
         })
         const priorLease = await prisma.lease.findFirst({
            where: {
               AND:{
                  unitNum: lease?.unitNum,
                  leaseEnded: null, 
               }
            }
         })
         if(priorLease){
            return error(403,{message:'That unit already has a lease'});
         }
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
         console.log(data);
         if (errors) {
            // Note: because of the nature of GraphQL, statusCode may be a 200 even when
            // there are errors.
            console.error('There were errors!')
            console.error(JSON.stringify(errors, null, 2));
            console.error(data?.data['createEtchPacket'])
         } else {
            const packetDetails = data?.data['createEtchPacket']
            console.log('Visit the new packet on your dashboard:', packetDetails.detailsURL)
            const updatedLease = await prisma.lease.update({
               where: {
                  leaseId: lease?.leaseId
               },
               data: {
                  anvilEID: packetDetails.etchPacket.eid,
               }
            })
            console.log(updatedLease);
            console.log(JSON.stringify(packetDetails, null, 2))
            return { packetDetails }
         }
      }
   }
});