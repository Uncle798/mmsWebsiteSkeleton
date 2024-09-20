import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";
import type { PriceCount } from "$lib/server/partialTypes";


const pricingSchema = z.object({
   price: z.number().min(0).int('must be a round number'), 
   size: z.string(),
   notes: z.string().optional(),
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user?.admin){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await superValidate(zod(pricingSchema));
   const pricing = await prisma.pricing.findMany({
      where:{
         endDate: null,
      },
      orderBy: {
         size: 'asc'
      }
   })
   const unitPricing = await prisma.unitPricing.findMany({
      where:{
         endDate: null,
      },
      orderBy:{
         unitNum: 'asc'
      }
   })
   const priceCount:PriceCount[] = [];
   pricing.forEach((price) =>{
      const unitPrice = unitPricing.filter((uP) => uP.price === price.price);
      const pC:PriceCount = { ...price, count:unitPrice.length};
      priceCount.push(pC);
   })

   return { priceCount, unitPricing, form };
})

export const actions: Actions = {
   default: async (event) =>{
      if(!event.locals.user?.admin){
         throw redirect(302, handleLoginRedirect(event));
      }
      const formData = await event.request.formData();
      const form = await superValidate(formData, zod(pricingSchema));
      if(!form.valid){
         return fail(400);
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id || event.getClientAddress())
		if(!success) {
         const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}

      return { form };
   }
};