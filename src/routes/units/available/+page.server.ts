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
      }, 
      where: {
         lease:{
            some: {
               leaseEnded: {
                  not: null
               }
            }
         },
         unavailable: false
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
   return { form, units };
})

export const actions: Actions ={

}