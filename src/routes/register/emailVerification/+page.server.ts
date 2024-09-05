import { lucia  } from '$lib/server/lucia';
import prisma from '$lib/server/prisma';
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'
import { verifyEmailVerificationRequest } from '$lib/server/authUtils';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/redis';

import type { PageServerLoad, Actions } from './$types';


const emailVerifySchema = z.object({
   code: z.string().min(8).max(8).trim()
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await superValidate(zod(emailVerifySchema));
   
   return { form, };
})

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(emailVerifySchema));
      if(!form.valid) {
         return message(form, 'Code must be 8 characters');
      }
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id ?? event.getClientAddress());
      if(!success){
         const timeRemaining = Math.floor((reset - Date.now()) / 1000);
         return message(form, `Please wait ${timeRemaining}s before trying again`);
      };
      const { user } = event.locals;
      if(user){
         const emailVerified = await verifyEmailVerificationRequest(user?.id, user?.email, form.data.code);
         if(emailVerified){
            await lucia.invalidateUserSessions(user.id);
            const dbUser = await prisma.user.update({
               where:{
                  id: user.id,
               },
               data:{
                  emailVerified: true,
               }
            });
            const session = await lucia.createSession(dbUser.id, {});
            const sessionCookie = await lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
               path: '.',
               ...sessionCookie.attributes
            });
         }
      }
      const redirectTo = event.url.searchParams.get('redirectTo');
      const unitNum = event.url.searchParams.get('unitNum');
      if(redirectTo){
         redirect(302,`${redirectTo.slice(1)}`)
      }
      if(unitNum){
         redirect(302, '/register/addressForm?unitNum=' + unitNum);
      }
      redirect(302, '/register/addressForm');
   }
}