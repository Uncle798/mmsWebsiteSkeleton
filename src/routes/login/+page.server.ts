import { lucia } from "$lib/server/lucia";
import prisma from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import { verify } from '@node-rs/argon2';
import { superValidate, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod';
import type { Actions, PageServerLoad } from "./$types";

const loginSchema = z.object({
   email: z.string().email().min(3).max(255).trim(),
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters').trim(),
})

export const load: PageServerLoad = (async () => {
   const form = await superValidate(zod(loginSchema))
   return {form};
})


export const actions:Actions = {
   default: async (event) => {
      const form = await superValidate(event.request, zod(loginSchema))
      if(!form.valid){
         return fail(400, { form })
      }
      const validEmail = form.data.email;
      const validPass = form.data.password;
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
      redirect(302, '/');
   }
}