import prisma from '$lib/server/prisma';
import { handleLoginRedirect } from "$lib/utils";

import { error, redirect } from '@sveltejs/kit';


export async function load(event) {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   if(event.locals.user.employee){
      const unitNum = event.params.unitNum;
      const unitPrice = await prisma.unitPricing.findFirst({
         where: {
            AND:[
               {unitNum},
               {endDate: null}
            ]
         }
      })
      const unit = await prisma.unit.findUnique({
         where:{
            num:unitNum
         }
      })
      const currentLease = await prisma.lease.findFirst({
         where:{
            AND:[
               {unitNum},
               {leaseEnded: null}
            ]
         }
      })
      if(unit && !currentLease){
         return {unit, unitPrice};
      }
      if(unit && currentLease){
         const currentCustomer = await prisma.contactInfo.findUnique({
            where:{
               contactId: currentLease?.contactInfoId
            }
         })
         const leaseEmployee = await prisma.user.findUnique({
            where:{
               id:currentLease?.employeeId
            }
         })
         return {unit, unitPrice, currentLease, currentCustomer, leaseEmployee}
      }
   }
   if(event.locals.user){
      const unitNum = event.params.unitNum;
      const unit = await prisma.unit.findFirst({
         where: {
            num:unitNum
         }
      })
      const unitPrice = await prisma.unitPricing.findFirst({
         where:{
            unitNum,
         }
      })
      return{unit, unitPrice}
   }
      error(404, 'Unit not found')
}