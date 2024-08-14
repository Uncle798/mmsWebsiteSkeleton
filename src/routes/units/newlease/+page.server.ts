import  prisma from "$lib/server/prisma";
import type { Actions, PageServerLoad } from './$types';
import {superValidate, message } from 'sveltekit-superforms';
import z from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from "@sveltejs/kit";

const newLeaseSchema = z.object({

})


export const load:PageServerLoad = (async ({locals}) =>{
   if(!locals.user!.employee){
      redirect(302, '/login')
   }
   const form = await superValidate(zod(newLeaseSchema));
   const units = await prisma.unitPricing.findMany({
      orderBy:{
         unitNum: 'asc'
      },
   })
   return { form, units }
})

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(newLeaseSchema));
      if(!form.valid){
         message(form, 'no good')
      }
   }
}
