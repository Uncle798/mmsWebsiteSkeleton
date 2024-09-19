import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";
import type { Lease } from "@prisma/client";
import type { PartialUser } from "$lib/server/partialTypes";

const leaseEndSchema = z.object({
   leaseId: z.string().min(23).max(30),
   customerId: z.string().min(23).max(30),
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const confirmForm = await superValidate(zod(leaseEndSchema));
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
   return { tableData, confirmForm }
}

export const actions:Actions = {
   default: async () =>{
      const form = await superValidate(zod(leaseEndSchema));
      if(!form.valid){
         return fail(400)
      }
      const { leaseId, customerId } = form.data;
      console.log(leaseId);
      let lease:Lease|null;
      if(leaseId){
         lease = await prisma.lease.findUnique({
            where:{
               leaseId
            }
         })
      } else{
         lease=null;
      }
      if(lease){
         if(lease.customerId !== customerId){
            return fail(404);
         }
      }
      if(lease?.customerId === customerId){
         await prisma.lease.update({
            where:{
               leaseId
            },
            data:{
               leaseEnded: new Date,
            }
         })
      }

   }
}