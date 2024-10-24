import { lucia } from "$lib/server/lucia";
import prisma from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import { verify } from '@node-rs/argon2';
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { loginSchema } from "$lib/formSchemas/schemas";
import { ratelimit } from "$lib/server/rateLimit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = (async (event) => {
   const mess = event.url.searchParams.get('message');
   const form = await superValidate(zod(loginSchema))
   return { form, mess };
})


export const actions:Actions = {
   default: async (event) => {
      const form = await superValidate(event.request, zod(loginSchema))
      if(!form.valid){
         return fail(400, { form })
      }
      const validEmail = form.data.email;
      const validPass = form.data.password;
      const { success, reset } = await ratelimit.login.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
      const user = await prisma.user.findFirst({
         where: {
            email: validEmail
         },
         omit:{
            passwordHash:false,
      }})
      if(!user){
         return message(form, 'Invalid username or password');
      }
      const checkedPass = await verify(user.passwordHash!, validPass, {
         memoryCost: 19456,
         timeCost: 2,
         outputLen: 32,
         parallelism: 1
      });

      if(!checkedPass){
         return message(form, 'Invalid username or password');
      }
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
         path: '.',
         ...sessionCookie.attributes
      });
      const redirectTo = event.url.searchParams.get('redirectTo');
      const unitNum = event.url.searchParams.get('unitNum');
      if(redirectTo){
         redirect(302,`${redirectTo.slice(1)}`)
      }
      if(unitNum){
         redirect(302, `units/newLease?unitNum=${unitNum}`)
      } else {
         redirect(302, '/');
      }
   }
}