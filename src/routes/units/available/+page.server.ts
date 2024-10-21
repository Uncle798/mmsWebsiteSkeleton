import prisma from "$lib/server/prisma";
import { z } from 'zod'
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'

import type { PageServerLoad, Actions } from "../$types";
import type { Unit } from "@prisma/client";

const availableUnitsSchema = z.object({
   unitId: z.string().min(23).max(30) ,
})

export const load:PageServerLoad = (async () => {
   const form = await superValidate(zod(availableUnitsSchema));
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
   const availableUnits: Unit[] =[];
   units.forEach((unit)=> {
      const unitLease = leases.find((lease) => lease.unitNum === unit.num);
      if(!unitLease ){
         availableUnits.push(unit);
      }
   })
   return { form, availableUnits };
})

export const actions: Actions ={

}