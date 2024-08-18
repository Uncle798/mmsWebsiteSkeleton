import type { PageLoad, Acctions } from './$types';
import { lucia } from '$lib/server/lucia';
import  prisma from "$lib/server/prisma";
import { z } from 'zod'
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { passwordResetToken } from "$lib/server/authUtils";
import { ratelimit } from "$lib/server/redis";

import type { Actions, PageServerLoad } from "./$types";
import { mailtrap } from '$lib/server/mailtrap';
import { send } from 'vite';
import { redirect } from '@sveltejs/kit';

const forgotPassSchema = z.object({
   email: z.string().min(3).max(255).email().trim().toLowerCase()
})

export const load:PageLoad = (async () => {
   const form = await superValidate(zod(forgotPassSchema))

   return {form};
})

export const actions:Actions = {
   default: async (event) =>{
      const form = await superValidate(event.request, zod(forgotPassSchema));
      if(!form.valid){
         return message(form, 'Please use a valid email');
      }
      const { success, reset } = await ratelimit.register.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      const user = await prisma.user.findUnique({
         where: {
            email:form.data.email
         }
      });
      if(!user){
         return message(form, 'An email will be sent to the email provided');
      }
      const verificationToken = await passwordResetToken(user.id);
      const verificationLink = 'http://localhost:5173/login/resetPassword/'+ verificationToken;
      const sender = {name: 'Computer@bransonschlegel.com', email:'computer@bransonschlegel.com'}
      mailtrap.send({
         from: sender,
         to: [{email: user.email!}],
         subject: 'Reset Password',
         html: `To reset the password please visit ${verificationLink}`
      });
      return message(form, 'An email has been sent to the registered email address')
   }
}