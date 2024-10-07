import { redirect } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user!.employee){
      redirect(302, '/login');
   }
   const unit = await prisma.unit.findUnique({
      where: {
         num: event.params.unitNum,
      }
   })
   const leases = await prisma.lease.findMany({
      where: {
         unitNum: event.params.unitNum
      },
      orderBy: {
         leaseEnded: 'desc'
      }
   })
   const customers = await prisma.user.findMany({
      where: {
         customerLeases: {
            some: {
               unitNum: event.params.unitNum
            }
         }
      }
   })
   const invoices = await prisma.invoice.findMany({
      where: {
         unitNum: event.params.unitNum
      },
      orderBy: {
         invoiceCreated: 'desc'
      }
   });
   const paymentRecords = await prisma.paymentRecord.findMany({
      where: {
         unitNum: event.params.unitNum
      }
   })

   return { unit, leases, customers, invoices, paymentRecords };
});