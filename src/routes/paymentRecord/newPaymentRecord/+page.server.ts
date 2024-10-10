import { superValidate, fail } from 'sveltekit-superforms';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad, Actions } from './$types';
const paymentRecordSchema = z.object({
   customerId: z.string(),
   invoiceId: z.string().nullable(),
   paymentAmount: z.number(),
   payee: z.string().optional(),
   paymentType: z.enum(['STRIPE', 'CASH', 'CHECK']),

})
export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user?.employee){
      redirect(302, '/login');
   }
   const form = await superValidate( zod(paymentRecordSchema));
   const customers = await prisma.user.findMany({
      where: {
         customerInvoices: {
            some: {
               invoicePaid: null,
            }
         }
      }
   });
   const invoices = await prisma.invoice.findMany({
      where: {
         invoicePaid: null,
      },
      orderBy: {
         invoiceCreated: 'desc'
      }
   })
   const addresses = await prisma.contactInfo.findMany({
      where:{
         softDelete: false
      }
   })
   return { form, customers, invoices, addresses };
});

export const actions: Actions = {
   default: async (event) =>{
      if(!event.locals.user?.employee){
      redirect(302, '/login');
      }
      const form = await superValidate( zod(paymentRecordSchema));
      console.log(form);
      if(!form.valid){
         return fail(400, {form})
      }
      const record = await prisma.paymentRecord.create({
         data: {
            customerId: form.data.customerId,
            receiverId: event.locals.user.id,
            invoiceId: form.data.invoiceId,
            paymentAmount: form.data.paymentAmount,
            paymentType: form.data.paymentType,
            payee: form.data.payee,
         }
      })
      console.log(record);
      return { form }
   }
};