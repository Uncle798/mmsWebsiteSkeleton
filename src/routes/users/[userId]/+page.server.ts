import prisma from "$lib/server/prisma";
import { redirect} from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import type { Invoice, PaymentRecord } from "@prisma/client";
import { handleLoginRedirect } from "$lib/utils.js";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import z from 'zod'
import type { PartialUser } from "$lib/server/partialTypes";
export type PaymentTableData = Invoice & PaymentRecord & PartialUser

export const load:PageServerLoad = async (event) => {
   if(!event.locals.user){
      console.log(event.request.url)
      return redirect(302, handleLoginRedirect(event));
   }
   const userId = event.params.userId;
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
      const payment = payments.find((p) => p.invoiceNum === invoice.invoiceId );
      if(payment){
         const datum:PaymentTableData = {...invoice, ...dbUser, ...payment};
         datum.unitNum = invoice.unitNum || '';
         tableData.push(datum);
      }
   })
   
   return {dbUser, contactInfo, leases, tableData,}
}  


export const actions:Actions = {
   default: async (event) => {
      // const form = await superValidate(event.request, zod(employeeFormSchema))
   }
}