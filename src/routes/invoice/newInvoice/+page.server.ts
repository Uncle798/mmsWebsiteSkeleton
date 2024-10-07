import { z } from 'zod';
import prisma from '$lib/server/prisma';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
const newInvoiceSchema = z.object({
   customerId: z.string().min(23).max(30),
   leaseId: z.string().min(23).max(30),
   invoiceAmount: z.number(),
   notes: z.string().nullable()
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user?.employee){
      redirect(302, '/login');
   }
   const form = await superValidate( zod(newInvoiceSchema));
   const units = await prisma.unit.findMany({
      orderBy: {
         num: 'asc'
      },
      where: {
         lease: {
            some:{
               leaseEnded: null
            }
         }
      }
   });
   const customers = await prisma.user.findMany({
      where: {
         customerLeases: {
            some: {
               leaseEnded: null
            }
         }
      }, 
   });
   const leases = await prisma.lease.findMany({
      where: {
         leaseEnded: null,
      }
   });
   const addresses = await prisma.contactInfo.findMany({
      where:{
         softDelete: false
      }
   })
   return { form, customers, units, leases, addresses };
});

export const actions: Actions = {
   default: async (event) =>{
      if(!event.locals.user?.employee){
      redirect(302, '/login');
      }
      const form = await superValidate( zod(newInvoiceSchema));
      if(!form.valid){
         console.log(form)
         return fail(400, {form})
      }


      const invoice = await prisma.invoice.create({
         data: {
            invoiceAmount: form.data.invoiceAmount,
            leaseId: form.data.leaseId,
            customerId: form.data.customerId, 
         }
      })
      console.log(invoice);
      return { form }
   }
};