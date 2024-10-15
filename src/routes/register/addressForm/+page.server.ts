import prisma from '$lib/server/prisma';
import { addressFormSchema } from '$lib/formSchemas/schemas';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/redis';
import type { PageServerLoad, Actions } from './$types';

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
      let phoneNum2:string = '';
      if(address.phoneNum2){
         phoneNum2 = phone2ResponseData.number;
         phone2ResponseData = await (await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${address.phoneNum2}&country_code=${address.phoneNum2Country}&format=1`)).json();
         if(!phone2ResponseData.valid){
            return message(form, "That is not a valid phone number")
         }
      }
      await prisma.user.update({
         where: {
            id: user?.id
         },
         data:{
            givenName: address.givenName,
            familyName: address.familyName,
            organizationName: address.organizationName,
         }
      })
      const dbAddress = await prisma.contactInfo.create({
         data:{
            address1:address.address1,
            address2:address.address2,
            city:address.city,
            state:address.state,
            zip:address.zip,
            country: address.country,
            phoneNum1: phone1ResponseData.number,
            phoneNum2,
            userId: user!.id,
         },
      }).catch((err) =>{
         return message(form, err);
      });
      const unitNum = event.url.searchParams.get('unitNum');
      if(dbAddress){
         const redirectTo = event.url.searchParams.get('redirectTo');
         if(redirectTo){
            redirect(302,`${redirectTo.slice(1)}`)
         }
         if(unitNum){
            redirect(302, '/newLease?unitNum=' + unitNum)
         }
         redirect(302, '/units/available');
      }
      redirect(302, '/units/available')
   }
} 