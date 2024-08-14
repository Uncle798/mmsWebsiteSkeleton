 import prisma from "$lib/server/prisma";
import  dayjs  from 'dayjs'
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "../$types";

type TableData = {
   unitNum: string,
   price: number,
   givenName: string | null,
   familyName: string | null,
   organizationName: string | null,
   leasedFor: number,
   emptyFor: number,
}

export const load:PageServerLoad = async ({locals}) =>{ 
   if(!locals.user){
      redirect(302, '/login');
   }
   const units = await prisma.unitPricing.findMany({
      where:{
         endDate: null
      },
      orderBy:{
         unitNum: 'asc'
      },
      select:{
         unitNum: true,
         price: true,
         unitPricingId: true,
         leases:{
            select:{
               leaseEffectiveDate: true,
               leaseEnded: true,
               price: true, 
               customer:{
                  select:{
                     familyName: true,
                     givenName: true,
                  }
               }
            }
         }
      }
   });

   // const contactInfo = await prisma.contactInfo.findMany({
   //    where:{
   //       softDelete: false
   //    },
   //    select:{
   //       familyName: true,
   //       givenName: true,
   //       organizationName: true,
   //       leases:{
   //          select:{
   //             id: true
   //          }
   //       }
   //    }
   // });

   const tableData:TableData[] = [];
   for (const unit of units) {
      const leases = unit.leases;
      let familyName: string | null = null;
      let givenName: string | null = null;
      let organizationName: string | null = null;
      let lastLeaseDate: Date | null = new Date();
      let leasedFor: number = 0;
      let emptyFor: number = 0;
      const today = dayjs();
      // leases.forEach((lease) => {
      //    const leaseStartDate = dayjs(lease.leaseEffectiveDate);
      //    const contact = lease.customer;
      //    if(!lease.leaseEnded){
      //       leasedFor = today.diff(leaseStartDate, 'months');
      //       familyName = contact.familyName;
      //       givenName = contact.givenName;
      //       if(lease.contactInfo.organizationName){
      //          organizationName = lease.contactInfo.organizationName;
      //       }
      //    }
      //    if(lease.leaseEnded < lastLeaseDate){
      //       lastLeaseDate = lease.leaseEnded;
      //    }
      // });
      if(lastLeaseDate){
         emptyFor = today.diff(lastLeaseDate, 'months');
         familyName = null;
         givenName = null;
         organizationName = null;
      } else {
         emptyFor = 0;
      }
      const unitNum = unit.unitNum;
      const row: TableData ={
         familyName,
         givenName,
         emptyFor, 
         organizationName,
         leasedFor,
         price: unit.price,
         unitNum
      }
      tableData.push(row);
   }
   return {
      tableData
   }
}