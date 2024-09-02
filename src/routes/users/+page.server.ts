import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import type { ContactInfo, Lease, User } from "@prisma/client";
import { handleLoginRedirect } from "$lib/utils";

export type TableData = User & ContactInfo & Lease

const employeeConfirm = z.object({
   employee: z.boolean(),
   admin: z.boolean(),
   userId: z.string(),
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await(superValidate(zod(employeeConfirm)))
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }, 
   });
   return { users, form }
}

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(employeeConfirm));
      if(!form.valid){
         return fail(400, {form});
      }
      console.log(form.data);
   }
}