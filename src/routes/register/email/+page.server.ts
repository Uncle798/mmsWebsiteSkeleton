import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { emailFormSchema } from '$lib/formSchemas/schemas';
import type { Actions } from './$types';

export const actions: Actions = {
   default: async (event) => {
       if(!event.locals.user){
           redirect(302, '/login');
       }
       const emailForm = await superValidate(event.request, zod(emailFormSchema));
       if(!emailForm.valid){
           fail(400, {emailForm})
       }
       const email = emailForm.data
       const dbUser = await prisma.user.create({
         data: {
            email: email.email,
            emailVerified: false
         }
       })
       console.log(dbUser);
       return { emailForm };
   }
};