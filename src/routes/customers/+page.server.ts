import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";
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
      }
   })
   const users:PartialUser[] = [];
   leases.forEach(async (lease) =>{
      const user = await prisma.user.findUnique({
         where: {
            id: lease.customerId,
         }
      });
      users.push(user!);
   })
   return { users, leases, form }
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