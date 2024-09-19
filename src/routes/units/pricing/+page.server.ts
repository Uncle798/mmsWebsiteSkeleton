import prisma from "$lib/server/prisma";
import { redirect, fail } from "@sveltejs/kit";
import { superValidate, message } from 'sveltekit-superforms'
import { ratelimit } from "$lib/server/redis";
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import type { PageServerLoad, Actions } from "../$types";
import { handleLoginRedirect } from "$lib/utils";
import type { PriceCount } from "$lib/server/partialTypes";

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user?.admin){
      throw redirect(302, handleLoginRedirect(event));
   }
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

   return { priceCount, unitPricing };
})