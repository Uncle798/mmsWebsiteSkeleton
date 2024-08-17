import { fail, redirect } from "@sveltejs/kit";
import { lucia } from '$lib/server/lucia';
import  prisma from "$lib/server/prisma";
import { sendEmail } from '$lib/server/nodemailer'
import { hash } from "@node-rs/argon2";
import { z } from 'zod'
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationRequest } from "$lib/server/authUtils";

const registerSchema = z.object({
   email: z.string().email().min(3).max(255).trim().toLowerCase(),
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters').trim(),
   passwordConfirm: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters').trim(),
})
.superRefine(({password, passwordConfirm}, context)=>{
   if(passwordConfirm !== password){
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['password']
      })
      context.addIssue({
         code: 'custom',
         message: 'Password must match confirm password', 
         path: ['confirmPassword']
      })
   }
})


export const load: PageServerLoad = (async () => {
   const form = await superValidate(zod(registerSchema))

   return {form};
})

export const actions:Actions = {
	default: async (event) =>{
		const form = await superValidate(event.request, zod(registerSchema))
		if(!form.valid){
			return fail(400, {form})
		}
		const validPass = form.data.password;
		const validEmail = form.data.email;
		const hashedPass = await hash(validPass, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		const userAlreadyExists = await prisma.user.findUnique({
			where:{
				email: validEmail
			}
		})
		if(!userAlreadyExists){
			return message(form, 'Email already in use')
		}
		const user = await prisma.user.create({
			data:{ 
				email: validEmail, 
				passwordHash: hashedPass
			}
		});
		const verificationCode = await generateEmailVerificationRequest(user.id, user.email!);
		sendEmail('computer@bransonschlegel.com', 'eric.branson@gmail.com', 'Testing', `testing: verification code: ${verificationCode}`);
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.', 
			...sessionCookie.attributes
		});
		redirect(302, '/');
	}
}