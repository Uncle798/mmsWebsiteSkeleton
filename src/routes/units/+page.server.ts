 import prisma from "$lib/server/prisma";
import  dayjs  from 'dayjs'
import { redirect } from "@sveltejs/kit";
import { handleLoginRedirect } from "$lib/utils";

import type { PageServerLoad } from "./$types";

type TableData = {
   unitNum: string,
   price: number,
   givenName?: string | null,
   familyName?: string | null,
   organizationName?: string | null,
   leasedFor: number,
   emptyFor: number,
   userId: string | null,
}

export const load:PageServerLoad = async (event) =>{ 
   if(!event.locals.user){
      throw redirect(302,handleLoginRedirect(event))
   }
   if(event.locals.user){
      throw redirect(303, '/units/available')
   }
   if(event.locals.user.employee){
      const leases = await prisma.lease.findMany({
         orderBy: {
            unitNum: 'asc'
         }
      });
      const units = await prisma.unitPricing.findMany({
         where: {
            endDate: null,
         }
      });
      const users = await prisma.user.findMany({})
      const tableData:TableData[] = [];
      const today = Date.now();
      units.forEach((unit) =>{
         const datum:TableData = {} as TableData;
         datum.unitNum = unit.unitNum;
         datum.price = unit.price;
         const unitLeases = leases.filter((lease) => lease.unitNum === unit.unitNum);
         let shortestMonthsSinceLeaseEnded = 0;
         let monthsSinceLeaseEnded = 0;
         if(unitLeases){
            for(let i=0; i<unitLeases.length; i++){
               const leaseEndDate = unitLeases[i].leaseEnded;
               if(!leaseEndDate) {
                  datum.familyName = users.find((user) => user.id === unitLeases[i].customerId)?.familyName;
                  datum.givenName = users.find((user) => user.id === unitLeases[i].customerId)?.givenName;
                  datum.organizationName = users.find((user) => user.id === unitLeases[i].customerId)?.organizationName;
                  datum.leasedFor = dayjs(today).diff(unitLeases[0].leaseEffectiveDate, 'months');
                  datum.emptyFor = 0;
                  break;
               } else {
                  monthsSinceLeaseEnded = dayjs(today).diff(leaseEndDate,'months');
               }
               if(shortestMonthsSinceLeaseEnded === 0){
                  shortestMonthsSinceLeaseEnded = monthsSinceLeaseEnded;
               } else if(monthsSinceLeaseEnded < shortestMonthsSinceLeaseEnded) {
                  shortestMonthsSinceLeaseEnded = monthsSinceLeaseEnded;
               }
               datum.emptyFor = shortestMonthsSinceLeaseEnded;
            }
            tableData.push(datum);
         }
      })
      return {
         tableData
      }
   }
}