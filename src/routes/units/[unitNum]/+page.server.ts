import prisma from '$lib/server/prisma';
import type { UnitPricing, Lease, User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';

type TableData = UnitPricing & Lease & User 

export async function load({ params, locals }) {
   if(!locals.user){
      redirect(302, '/login')
   }
   const unitNum = params.unitNum;
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
   error(404, 'Unit not found')
}