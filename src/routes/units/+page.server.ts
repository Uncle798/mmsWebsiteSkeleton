 import prisma from "$lib/server/prisma";
import  dayjs  from 'dayjs'
import { redirect, fail } from "@sveltejs/kit";
import { handleLoginRedirect } from "$lib/utils";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

import type { PageServerLoad, Actions } from "./$types";

type TableData = {
   unitNum: string,
   price: number,
   givenName?: string | null,
   familyName?: string | null,
   organizationName?: string | null,
   leasedFor: number,
   emptyFor: number,
   userId: string | null,
}

const pricingSchema = z.object({
   size: z.string().min(5).max(7).trim(),
   price: z.number().int().min(0).max(10000)
});
const unitComponentSchema =  z.object({
   notes: z.string().optional(),
   unavailable: z.boolean().nullable(),
   unitNum: z.string().min(3).max(6),
})
export type UnitComponentSchema = typeof unitComponentSchema;

export const load:PageServerLoad = async (event) =>{ 
   if(!event.locals.user){
      throw redirect(302,handleLoginRedirect(event))
   }
   if(!event.locals.user.employee){
      throw redirect(302, '/units/available')
   }
   if(event.locals.user.employee){
      const form = superValidate(zod(pricingSchema), {id: 'pricingFrom'});
      const unitComponentForm = superValidate(zod(unitComponentSchema), {id: 'unitComponentForm'});
      const leases = await prisma.lease.findMany({
         orderBy: {
            unitNum: 'asc'
         },
         where: {
            leaseEnded: null
         }
      });
      const units = await prisma.unit.findMany({
         orderBy: {
            num: 'asc'
         }
      });
      const users = await prisma.user.findMany({
         where: {
            customerLeases:{
               some:{
                  leaseEnded:null
               }
            }
         }
      })
      const today = Date.now();
      type SizePrice ={
         size: string,
         price: number,
      }
      const sizesPrices:SizePrice[]=[];
      units.forEach((unit) =>{
         const size = sizesPrices.find((s) => s.size === unit.size);
         if(!size){
            const sizePrice = {} as SizePrice;
            sizePrice.size = unit.size;
            sizePrice.price=unit.advertisedPrice;
            sizesPrices.push(sizePrice);
         }
      });
      sizesPrices.sort((a,b) => a.size > b.size ? 1 : 
      (b.size > a.size) ? -1 : 0);
      return {
         units,
         leases,
         users,
         sizesPrices,
         form,
         unitComponentForm,
      }
   }
}

export const actions:Actions = {
   changePrice: async (event) => {
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(pricingSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
		if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      console.log(form.data.price);
      const units = await prisma.unit.updateMany({
         where: {
            size: form.data.size,
         },
         data: {
            advertisedPrice: form.data.price
         }
      })
      console.log(units)
      return { form }
   },
   unitComponentForm: async (event) => {
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(unitComponentSchema));
      if(!form.valid){
         return fail(400, {form});
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
      if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
         return message(form, `Please wait ${timeRemaining}s before trying again.`)
      }
      console.log(form.data.notes);
      await prisma.unit.update({
         where: {
            num: form.data.unitNum,
         },
         data:{
            unavailable: form.data.unavailable || false,
            notes: form.data.notes,
         }
      })
      return { form }
   }
}