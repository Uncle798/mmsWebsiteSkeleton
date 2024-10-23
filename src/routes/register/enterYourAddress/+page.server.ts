import prisma from '$lib/server/prisma';
import { addressFormSchema, nameFormSchema } from '$lib/formSchemas/schemas';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/rateLimit';
import type { PageServerLoad, Actions } from './$types';

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const nameForm = await superValidate(zod(nameFormSchema));
   const addressForm = await superValidate(zod(addressFormSchema));
   return { addressForm, nameForm};
})

export const actions:Actions = {
   default: async (event) =>{
      const addressForm = await superValidate(event.request, zod(addressFormSchema));
      const nameForm = await superValidate(event.request, zod(nameFormSchema));
      if(!addressForm.valid) {
         return message(addressForm, 'Please enter a valid address');
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id ?? event.getClientAddress());
      if(!success){
         const timeRemaining = Math.floor((reset - Date.now()) / 1000);
         return message(addressForm, `Please wait ${timeRemaining}s before trying again`);
      };
      const { user } = event.locals;
      const address = addressForm.data;
      const phone1ResponseData = await (await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NUMVERIFY_API_KEY}&number=${address.phoneNum1}&country_code=${address.phoneNum1Country}&format=1`)).json();
      if(!phone1ResponseData.valid){
         return message(addressForm, "That is not a valid phone number")
      }
      if(nameForm.valid){
        const dbUser = await prisma.user.update({
            where: {
               id: user?.id
            },
            data:{
               givenName: nameForm.data.givenName,
               familyName: nameForm.data.familyName,
               organizationName: address.organizationName,
            }
         })
         console.log(dbUser);
      }
      if(address.organizationName){
         await prisma.user.update({
            where: {
               id: user?.id
            },
            data: {
               organizationName: address.organizationName
            }
         })
      }
      const dbAddress = await prisma.contactInfo.create({
         data:{
            address1:address.address1,
            address2:address.address2,
            city:address.city,
            state:address.state,
            zip:address.zip,
            country: address.country,
            phoneNum1: phone1ResponseData.number,
            phoneNum1Country: phone1ResponseData.country,
            userId: user!.id,
         },
      }).catch((err) =>{
         return message(addressForm, err);
      });
      console.log(dbAddress);
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