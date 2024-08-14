import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PaymentRecord, User } from "@prisma/client";

export type PaymentTableData = PaymentRecord & User

export async function load({ params, locals}) {
   if(!locals.user?.employee){
      redirect(302, '/login')
   }
   const userId = params.userId;
   const dbUser = await prisma.user.findUnique({
      where:{
         id:userId
      }
   })
   const contactInfo = await prisma.contactInfo.findMany({
      where:{
         email: dbUser!.email!,
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