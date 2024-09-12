import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";


const employeeConfirmSchema = z.object({
   employee: z.string(),
   admin: z.string().optional(),
   userId: z.string().min(23).max(30),
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await(superValidate(zod(employeeConfirmSchema)))
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }, 
   });
   return { users, form }
}

export const actions:Actions = {
   default: async (event) =>{
      const formData = await event.request.formData();
      console.log(formData)
      const form = await superValidate(formData, zod(employeeConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
   }
}