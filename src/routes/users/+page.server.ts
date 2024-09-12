import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate } from 'sveltekit-superforms'
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
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(employeeConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      console.log(form);
      if(form.data.employee){
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               employee: form.data.employee
            }
         })
      } else {
         await prisma.user.update({
            where:{
               id: form.data.userId
            },
            data:{
               employee: false,
            }
         })
      }
      return redirect(302, '/users')
   },
   changeAdminStatus: async (event) =>{
      const formData = await event.request.formData();
      console.log(formData)
      const form = await superValidate(formData, zod(adminConfirmSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      console.log(form);
      if(form.data.admin){
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               admin: form.data.admin
            }
         })
      } else {
         await prisma.user.update({
            where:{
               id: form.data.userId,
            },
            data:{
               admin: false,
            }
         })
      }
      return redirect(302, '/users')
   },

}