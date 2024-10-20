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
      const contactInfo = await prisma.contactInfo.findMany({
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
      const tableData:PaymentTableData[]=[];
      invoices.forEach((invoice) =>{
         const payment = payments.find((p) => p.paymentId === invoice.invoiceId );
         if(payment){
            const datum:PaymentTableData = {...invoice, ...dbUser, ...payment};
            tableData.push(datum);
         }
      })
      
      return { dbUser, contactInfo, leases, tableData, addressForm, nameForm, passwordForm, emailForm }
   }
   if(event.locals.user && !event.locals.user.employee){
      if(event.locals.user.id !== userId){
         redirect(302, handleLoginRedirect(event));
      }
      const contactInfos = await prisma.contactInfo.findMany({
         where: {
            userId: event.locals.user.id
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
      return { contactInfos, leases, paymentRecords, invoices, nameForm, addressForm, passwordForm, emailForm }
   }
}  