import prisma from '$lib/server/prisma';
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/redis';
import type { PageServerLoad, Actions } from './$types';

const addressFormSchema = z.object({
   familyName: z.string().min(1).max(255).trim(),
   givenName: z.string().min(1).max(255).trim(),
   organizationName: z.string().min(1).max(255).trim(),
   address1: z.string().min(2).max(255).trim(),
   address2: z.string().min(2).max(255).trim().optional(),
   city: z.string(),
   state: z.string().min(2).max(255),
   zip: z.string(),
   phoneNum1: z.string().min(10).max(12).trim(),
   phoneNum1Country: z.string().min(2).max(2).trim(),
   phoneNum2: z.string().min(10).max(12).trim().optional(),
   phoneNum2Country: z.string().min(2).max(2).trim().optional(),
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   if(event.locals.user.employee){
      const form = await superValidate(zod(addressFormSchema));

      return { form, };
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
      const phone1ResponseData = await (await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${address.phoneNum1}&country_code=${address.phoneNum1Country}&format=1`)).json();
      if(!phone1ResponseData.valid){
         return message(form, "That is not a valid phone number")
      }
      let phone2ResponseData: typeof phone1ResponseData;
      if(address.phoneNum2){
         phone2ResponseData = await (await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${address.phoneNum2}&country_code=${address.phoneNum2Country}&format=1`)).json();
         if(!phone2ResponseData.valid){
            return message(form, "That is not a valid phone number")
         }
      }
      const dbAddress = await prisma.contactInfo.create({
         data:{
            address1:address.address1,
            address2:address.address2,
            address3:address.address3,
            city:address.city,
            state:address.state,
            zip:address.zip,
            phoneNum1: phone1ResponseData.number,
            phoneNum2: phone2ResponseData.number ?? null,
            userId: user?.id,
         },
      });
      if(dbAddress){
         const redirectTo = event.url.searchParams.get('redirectTo');
         if(redirectTo){
            redirect(302,`${redirectTo.slice(1)}`)
         }
         redirect(302, '/units/available');
      }
   }
} 