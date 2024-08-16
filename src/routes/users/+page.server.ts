import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import type { ContactInfo, Lease, User } from "@prisma/client";
import { handleLoginRedirect } from "$lib/utils";

export type TableData = User & ContactInfo & Lease

const userFormSchema = z.object({
   familyName: z.string().min(1).max(255).trim(),
   givenName: z.string().min(1).max(255).trim(),
   email: z.string().email().min(3).max(255).trim(),
   organizationName: z.string().min(1).max(512).trim(),
   userId: z.string(),
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await(superValidate(zod(userFormSchema)))
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }, 
      where:{
         employee: false,
      }, 
   });
   return { users, form }
}

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(userFormSchema));
      if(!form.valid){
         return fail(400, {form});
      }
   }
}