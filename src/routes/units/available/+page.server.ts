import prisma from "$lib/server/prisma";
import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'

import type { PageServerLoad, Actions } from "../$types";
import type { Unit, UnitPricing } from "@prisma/client";

const availableUnitsSchema = z.object({
   unitPriceId: z.string() ,
})

export const load:PageServerLoad = (async () => {
   const form = await superValidate(zod(availableUnitsSchema));
   const unitPricing = await prisma.unitPricing.findMany({
      orderBy: {
         unitNum: 'asc'
      }
   });
   const units = await prisma.unit.findMany({
      orderBy: {
         num:'asc'
      }
   })
   const leases = await prisma.lease.findMany({
      where:{
         leaseEnded: null,
      },
      orderBy:{
         unitNum: 'asc'
      }
   })
   const availableUnits:UnitPricing[] & Unit[] =[];
   unitPricing.forEach((unitPrice)=> {
      const unitLease = leases.find((lease) => lease.unitNum === unitPrice.unitNum);
      console.log(`unitNum: ${unitPrice.unitNum} unitLease: ${unitLease}`);
      
      const unitInfo = units.find((u)=> u.num === unitPrice.unitNum);
      if(!unitLease){
         console.log(`unitNum: ${unitPrice.unitNum} unitInfo: ${unitInfo}`);
         const availableUnit = { ... unitInfo, ...unitPrice};
            availableUnits.push(availableUnit);
      }
   })
   return { form, availableUnits };
})

export const actions: Actions ={

}