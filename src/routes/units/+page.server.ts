 import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { handleLoginRedirect } from "$lib/utils";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'

import type { PageServerLoad, Actions } from "./$types";
import type { ContactInfo, Lease, Unit } from "@prisma/client";
import type { PartialUser } from "$lib/server/partialTypes";

const pricingSchema = z.object({
   size: z.string().min(5).max(7).trim(),
   price: z.number().int().min(0).max(10000),
   lowerPrice: z.boolean().nullable(),
});
const unitComponentSchema =  z.object({
   notes: z.string().optional(),
   unavailable: z.boolean().nullable(),
   unitNum: z.string().min(3).max(6),
});
const endLeaseSchema = z.object({
   leaseId: z.string().min(23).max(30),
})
export type UnitComponentSchema = typeof unitComponentSchema;
export type UnitCustomer = Unit & PartialUser & Lease & ContactInfo;

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
            sizePrice.price = unit.advertisedPrice;
            sizesPrices.push(sizePrice);
         }
      });
      sizesPrices.sort((a,b) => a.size > b.size ? 1 : 
      (b.size > a.size) ? -1 : 0);
      return {
         units,
         leases, 
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
      const unit = await prisma.unit.findFirst({
         where: {
            size: form.data.size,
         }
      })
      console.log(form.data.lowerPrice);
         if(form.data.price < unit?.advertisedPrice && form.data.lowerPrice === null){
            return message(form, `Please select Lower Price to lower the price of all\
                ${form.data.size.replace(/^0+/gm,'').replace(/x0/gm,'x')} units.` )
         }
         if(form.data.price === unit?.advertisedPrice && form.data.lowerPrice === null){
            return message(form, 
               `No change in price for ${form.data.size.replace(/^0+/gm,'').replace(/x0/gm,'x')} units.` )
         }
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
   },
   endLease: async (event) =>{
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(endLeaseSchema));
      await prisma.lease.update({
         where: {
            leaseId: form.data.leaseId
         },
         data:{
            leaseEnded: new Date,
         }
      })
      return { form }
   }
   
}