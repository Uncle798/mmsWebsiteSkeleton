import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import z from 'zod'
import { superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";

const employeeAddSchema = z.object({
   userId: z.string().min(23).max(25).trim(),
   admin: z.boolean(),
})

export const load: PageServerLoad = (async (event) =>{
   if(!event.locals.user?.admin){
      throw redirect(302, handleLoginRedirect(event, "You must be an administrator to access that page"));
   }
   const form = await(superValidate(zod(employeeAddSchema)))

   const users = prisma.user.findMany({
      orderBy:{
         familyName: 'asc'
      }
   })
   return { users, form } 
})


export const actions:Actions = {
   default: async (event) => {
      const form = await superValidate(event.request, zod(employeeAddSchema))
      console.log(form)
      if(form.valid){
         const user = await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               employee: true,
               admin: form.data.admin,
            }
         })
      }
   },
}