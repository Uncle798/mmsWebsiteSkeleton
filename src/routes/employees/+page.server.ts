import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import z from 'zod'
import { superValidate } from "sveltekit-superforms";
import { zod } from 'sveltekit-superforms/adapters'
import type { PageServerLoad } from "../$types";
import { handleLoginRedirect } from "$lib/utils";


const employeeRemoveSchema = z.object({
   remove: z.boolean(),
   employeeId: z.string()
})

export const load: PageServerLoad = (async (event) =>{
   if(!event.locals.user?.admin){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await(superValidate(zod(employeeRemoveSchema)))

   const employees = await prisma.user.findMany({
      where:{
         employee: true
      }
   })
   return { employees, form } 
})

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(employeeRemoveSchema))
      console.log(form)
      if(form.valid){
         user = await prisma.user.update({
            where:{
               id: form.data.employeeId,
            },
            data:{
               employee: false,
               admin: false,
            }
         })
      }
   }
}