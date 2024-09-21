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
      throw redirect(302, '/units/available')
   }
   if(event.locals.user.employee){
      const leases = await prisma.lease.findMany({
         orderBy: {
            unitNum: 'asc'
         }
      });
      const units = await prisma.unit.findMany({
         orderBy: {
            num: 'asc'
         }
      });
      const users = await prisma.user.findMany({})
      const tableData:TableData[] = [];
      const today = Date.now();
      const sizes:string[]=[];
      units.forEach((unit) =>{
         const size = sizes.find((s) => s === unit.size);
         if(!size){
            sizes.push(unit.size);
         }
         const datum:TableData = {} as TableData;
         datum.unitNum = unit.num;
         datum.price = unit.advertisedPrice;
         const unitLeases = leases.filter((lease) => lease.unitNum === unit.num);
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
                  datum.price = unitLeases[i].price;
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
         tableData,
         sizes
      }
   }
}