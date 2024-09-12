import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";

const employeeConfirmSchema = z.object({
   employee: z.boolean().optional(),
   userId: z.string().min(23).max(30),
})
const adminConfirmSchema = z.object({
   admin: z.boolean().optional(),
   userId: z.string().min(23).max(30),
})

export const load:PageServerLoad = async (event) =>{
   if(!event.locals.user?.admin){
      throw redirect(302, handleLoginRedirect(event));
   }
   const employeeForm = await superValidate(zod(employeeConfirmSchema), {id: 'employee'});
   const adminForm = await superValidate(zod(adminConfirmSchema), {id: 'admin'});
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }, 
   });
   return { users, employeeForm, adminForm }
}

export const actions:Actions = {
   changeEmployeeStatus: async (event) =>{
      if(!event.locals.user?.admin){
         return redirect(302, handleLoginRedirect(event));
      }
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(employeeConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
		if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      const user = await prisma.user.findFirst({
         where: {
            id: form.data.userId,
         }
      })
      if(user?.employee){
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               employee: false,
            }
         })
      } else {
         await prisma.user.update({
            where:{
               id: form.data.userId
            },
            data:{
               employee: true,
            }
         })
      }
      return { form, }
   },
   changeAdminStatus: async (event) =>{
      if(!event.locals.user?.admin){
         return redirect(302, handleLoginRedirect(event));
      }
      const formData = await event.request.formData();
      console.log(formData)
      const form = await superValidate(formData, zod(adminConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      const user = await prisma.user.findUnique({
         where: {
            id: form.data.userId,
         }
      })
      if(user?.admin){
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               admin: false
            }
         })
      } else {
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               admin: true,
            }
         })
      }
      return {
         form,
         success: true,
      }
   },

}