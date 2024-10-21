import prisma from "$lib/server/prisma";
import { redirect} from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import type { Invoice, PaymentRecord } from "@prisma/client";
import { handleLoginRedirect } from "$lib/utils.js";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PartialUser } from "$lib/server/partialTypes";
import { addressFormSchema, emailFormSchema, nameFormSchema, passwordFormSchema } from "$lib/formSchemas/schemas";
export type PaymentTableData = Invoice & PaymentRecord & PartialUser

export const load:PageServerLoad = async (event) => {
   if(!event.locals.user){
      return redirect(302, handleLoginRedirect(event));
   }
   const addressForm = await superValidate(zod(addressFormSchema));
   const nameForm = await superValidate(zod(nameFormSchema));
   const passwordForm = await superValidate(zod(passwordFormSchema));
   const emailForm = await superValidate(zod(emailFormSchema));
   const userId = event.params.userId;
   if(event.locals.user.employee){
      const dbUser = await prisma.user.findUnique({
         where:{
            id:userId
         }
      })
      const contactInfo = await prisma.contactInfo.findFirst({
         where:{
            userId:dbUser?.id,
            softDelete: false
         }
      })
      const leases = await prisma.lease.findMany({
         where: {
            customerId: dbUser?.id,
         }
      })
      const invoices = await prisma.invoice.findMany({
         where:{
            customerId: userId
         }
      })
      const payments = await prisma.paymentRecord.findMany({
         where:{
            customerId:dbUser?.id
         }
      })
      return { dbUser, contactInfo, leases, invoices, payments, addressForm, nameForm, passwordForm, emailForm }
   }
   if(event.locals.user && !event.locals.user.employee){
      if(event.locals.user.id !== userId){
         redirect(302, handleLoginRedirect(event));
      }
      const contactInfo = await prisma.contactInfo.findFirst({
         where: {
            userId: event.locals.user.id,
            softDelete: false,
         }
      });
      const leases = await prisma.lease.findMany({
         where: {
            customerId: event.locals.user.id
         },
         orderBy: {
            unitNum: 'asc'
         }
      })
      const paymentRecords = await prisma.paymentRecord.findMany({
         where: {
            customerId: event.locals.user.id
         }
      });
      const invoices = await prisma.invoice.findMany({
         where: {
            customerId: event.locals.user.id
         }
      })
      return { contactInfo, leases, paymentRecords, invoices, nameForm, addressForm, passwordForm, emailForm }
   }
}  