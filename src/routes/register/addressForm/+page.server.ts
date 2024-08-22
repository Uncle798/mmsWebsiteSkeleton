import prisma from '$lib/server/prisma';
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/redis';

import type { PageServerLoad, Actions } from './$types';

const addressFormSchema = z.object({
   address1: z.string().min(2).max(255).trim(),
   address2: z.string().min(2).max(255).trim().optional(),
   address3: z.string().min(2).max(255).trim().optional(),
   city: z.string(),
   state: z.string().min(2).max(255),
   zip: z.string(),
   phoneNum1: z.string(),
   phoneNum2: z.string(),
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await superValidate(zod(addressFormSchema));
   
   return { form, };
})

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(addressFormSchema));
      if(!form.valid) {
         return message(form, 'Code must be 8 characters');
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id ?? event.getClientAddress());
      if(!success){
         const timeRemaining = Math.floor((reset - Date.now()) / 1000);
         return message(form, `Please wait ${timeRemaining}s before trying again`);
      };
      const { user } = event.locals;
      const address = form.data;
      const dbAddress = await prisma.contactInfo.create({
         data:{
            address1:address.address1,
            address2:address.address2,
            address3:address.address3,
            city:address.city,
            state:address.state,
            zip:address.zip,
            phoneNum1: address.phoneNum1,
            phoneNum2: address.phoneNum2,
            userId: user?.id,
         },
      });
      if(dbAddress){
         const redirectTo = event.url.searchParams.get('redirectTo');
         if(redirectTo){
            redirect(302,`${redirectTo.slice(1)}`)
         }
         redirect(302, '/');
      }
      }

} 