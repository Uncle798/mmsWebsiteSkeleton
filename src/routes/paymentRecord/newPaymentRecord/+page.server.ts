import { superValidate, fail } from 'sveltekit-superforms';
import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { paymentRecordSchema } from '$lib/formSchemas/schemas';
import type { PageServerLoad, Actions } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user?.employee){
      redirect(302, '/login');
   }
   const form = await superValidate(event.request, zod(paymentRecordSchema));
   const customers = await prisma.user.findMany({
      where: {
         customerInvoices: {
            some: {
               invoicePaid: null,
            }
         }
      },
      orderBy: {
         familyName: 'asc'
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
   });
   const leases = await prisma.lease.findMany({})
   return { form, customers, invoices, addresses, leases };
});

export const actions: Actions = {
   default: async (event) =>{
      if(!event.locals.user?.employee){
      redirect(302, '/login');
      }
      const formData = await event.request.formData();
      console.log(formData);
      const form = await superValidate(formData, zod(paymentRecordSchema));
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
            paymentCompleted: new Date,
            paymentNotes: form.data.paymentNotes,
         }
      })
      console.log(record)
      const invoice = await prisma.invoice.update({
         where: {
            invoiceId: record.invoiceId!,
         },
         data:{
            paymentRecordId: record.paymentId,
            invoicePaid: record.paymentCompleted,
         }
      })
      console.log(invoice)
      return { form }
   }
};