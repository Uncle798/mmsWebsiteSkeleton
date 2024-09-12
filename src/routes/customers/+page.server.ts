import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";
import type { Lease } from "@prisma/client";
import type { PartialUser } from "$lib/server/partialTypes";

const customerSchema = z.object({
   customerId: z.string().min(23).max(30)
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await(superValidate(zod(customerSchema)))
   const leases = await prisma.lease.findMany({
      where: {
         leaseEnded: null,
      },
      orderBy: {
         unitNum:'asc'
      }
   })
   const users = await prisma.user.findMany({
      where:{
         customerLeases:{
            some:{
               leaseEnded: null,
            }
         }
      }
   })
   type TableData = PartialUser & Lease;
   const tableData:TableData[]=[];
   leases.forEach((lease) =>{
      const user = users.find((u) => u.id === lease.customerId);
      if(user){
         const datum:TableData = {...lease, ...user}; 
         tableData.push(datum);
      }
   })
   return { tableData, form }
}

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(customerSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      console.log(form.data);
   }
}