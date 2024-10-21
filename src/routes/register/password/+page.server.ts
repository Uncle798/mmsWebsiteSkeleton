import prisma from '$lib/server/prisma';
import { superValidate, message } from 'sveltekit-superforms';
import { zxcvbn } from "@zxcvbn-ts/core";
import { hash } from "@node-rs/argon2";
import { ratelimit } from '$lib/server/rateLimit';
import { passwordFormSchema } from '$lib/formSchemas/schemas';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect, fail } from '@sveltejs/kit';

export const load = (async () => {
   const passwordForm = await superValidate(zod(passwordFormSchema))
    return { passwordForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event ) =>{
      if(!event.locals.user){
         redirect(302, '/login')
      }
      const passwordForm = await superValidate(event.request, zod(passwordFormSchema));
      if(!passwordForm.valid){
         return fail(400, {passwordForm})
      }
      const { success, reset } = await ratelimit.register.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(passwordForm, `Please wait ${timeRemaining}s before trying again.`)
		}
		const validPass = passwordForm.data.password;
		const passStrength = zxcvbn(validPass);
		if(passStrength.score < 3) {
			return message(passwordForm, 'Please use a stronger password')
		}
		const hashedPass = await hash(validPass, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
      await prisma.user.update({
         where: {
            id: event.locals.user.id
         },
         data: {
            passwordHash: hashedPass
         }
      })
      return { passwordForm }
   }
};