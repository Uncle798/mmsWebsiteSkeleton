import { lucia  } from '$lib/server/lucia';
import prisma from '$lib/server/prisma';
import { z } from 'zod'
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters'
import { verifyEmailVerificationRequest } from '$lib/server/authUtils';
import { redirect } from '@sveltejs/kit';
import { handleLoginRedirect } from '$lib/utils';
import { ratelimit } from '$lib/server/rateLimit';
import { generateEmailVerificationRequest } from '$lib/server/authUtils';
import { mailtrap } from '$lib/server/mailtrap';

import type { PageServerLoad, Actions } from './$types';


const emailVerifySchema = z.object({
   code: z.string().min(8).max(8).trim()
})

export const load:PageServerLoad = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event));
   }
   const form = await superValidate(zod(emailVerifySchema));
   const { success, reset } = await ratelimit.emailVerification.limit(event.locals.user.id)
   if(!success) {
      const timeRemaining = Math.floor((reset - Date.now()) /1000);
      return message(form, `Please wait ${timeRemaining}s before trying again.`)
   }
   const { user } = event.locals
   const verificationCode = await generateEmailVerificationRequest(user.id, user.email!);
		const sender = {
			name: 'computer@bransonschlegel.com',
			email: 'computer@bransonschlegel.com',
		}
		mailtrap.send({
			from:sender,
			to: [{email: user.email!}],
			subject: "Please verify your email",
			html: `Sending a new verification code: ${verificationCode}`
		}).catch((err) =>{
			console.error(err);
		})
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
            console.log('emailVerification' + dbUser)
            const session = await lucia.createSession(dbUser.id, {});
            const sessionCookie = await lucia.createSessionCookie(session.id);
            event.cookies.set(sessionCookie.name, sessionCookie.value, {
               path: '.',
               ...sessionCookie.attributes
            });
         }
         const redirectTo = event.url.searchParams.get('redirectTo');
         const unitNum = event.url.searchParams.get('unitNum');
         if(redirectTo){
            redirect(302,`${redirectTo.slice(1)}`)
         }
         if(unitNum){
            redirect(302, '/register/tellUssAboutYou?unitNum=' + unitNum);
         }
         redirect(302, '/register/tellUsAboutYou');
      }
      return { form }
   }
}