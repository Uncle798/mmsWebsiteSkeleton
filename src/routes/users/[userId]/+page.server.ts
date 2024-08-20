import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PaymentRecord, User } from "@prisma/client";
import { handleLoginRedirect } from "$lib/utils.js";

export type PaymentTableData = PaymentRecord & User

export async function load(event) {
   if(!event.locals.user?.employee){
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
   const payments = await prisma.paymentRecord.findMany({
      where:{
         customerId:dbUser?.id
      }
   })
   if(payments){
      const paymentTableData:PaymentTableData[] = [];
      for await (const payment of payments){
         const employee = await prisma.user.findFirst({
            where: {
               id: payment.receiverId,
            }
         })
         const paymentTableDatum = {} as PaymentTableData;
         Object.assign(paymentTableDatum, payment);
         Object.assign(paymentTableDatum, employee);
         paymentTableData.push(paymentTableDatum);
      }
      return { dbUser, contactInfo, leases, paymentTableData }
   } else{

      return{ dbUser, contactInfo, leases}
   }
}  