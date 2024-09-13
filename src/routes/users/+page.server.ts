import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";

const employeeConfirmSchema = z.object({
   employee: z.boolean().nullable(),
   admin: z.boolean().nullable(),
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
      if(form.data.userId === event.locals.user.id){
         return message(form, 'You can not change your own employment status');
      }
      console.log(form.data)
      const admins = await prisma.user.findMany({
         where:{
            admin: true, 
         }
      })
      if(admins.length <= 1 && !form.data.admin){
         return message(form, 'You must have at least one Admin');
      }
      if(form.data.admin){
         await prisma.user.update({
            where: {
               id: form.data.userId,
            },
            data: {
               employee: true,
               admin: true,
            }
         })
      }
      if(form.data.employee && !form.data.admin){
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               employee: true,
               admin: false,
            }
         })
      } 
      if(!form.data.employee){
         await prisma.user.update({
            where:{
               id: form.data.userId
            },
            data:{
               employee: false,
               admin: false
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
      const form = await superValidate(formData, zod(adminConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
		if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      if(form.data.userId === event.locals.user.id){
         return message(form, 'You can not change your own employment status');
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
               employee: true, 
            }
         })
      }
      return {
         form,
         success: true,
      }
   },

}