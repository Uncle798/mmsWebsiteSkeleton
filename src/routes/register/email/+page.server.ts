import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
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
       const emailInUse = await prisma.user.findUnique({
            where: {
                email:email.email,
            }
       })
       if(emailInUse){
            return message(emailForm, 'Email in use please use another');
       }
       if(email.email === email.emailConfirm){
           const dbUser = await prisma.user.create({
             data: {
                email: email.email,
                emailVerified: false
             }
           })
           console.log(dbUser);
       }
       return { emailForm };
   }
};