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
      const newPaymentForm = await superValidate(formData, zod(paymentRecordSchema));
      if(!newPaymentForm.valid){
         return fail(400, {newPaymentForm})
      }
      const record = await prisma.paymentRecord.create({
         data: {
            customerId: newPaymentForm.data.customerId,
            receiverId: event.locals.user.id,
            invoiceId: newPaymentForm.data.invoiceId,
            paymentAmount: newPaymentForm.data.paymentAmount,
            paymentType: newPaymentForm.data.paymentType,
            payee: newPaymentForm.data.payee,
            paymentCompleted: new Date,
            paymentNotes: newPaymentForm.data.paymentNotes,
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
      return { newPaymentForm }
   }
};