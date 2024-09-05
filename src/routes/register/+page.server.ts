import { fail, redirect } from "@sveltejs/kit";
import { lucia } from '$lib/server/lucia';
import  prisma from "$lib/server/prisma";
import { mailtrap } from "$lib/server/mailtrap";
import { hash } from "@node-rs/argon2";
import { z } from 'zod'
import { zxcvbn } from "@zxcvbn-ts/core";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationRequest } from "$lib/server/authUtils";
import { ratelimit } from "$lib/server/redis";


const registerSchema = z.object({
   email: z.string().email().min(3).max(255).trim().toLowerCase(),
   password: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
   passwordConfirm: z.string().min(6, 'Password must be at least 6 characters')
      .max(255,'Password can\'t be longer than 255 characters'),
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


export const load: PageServerLoad = (async (event) => {
   const form = await superValidate(zod(registerSchema))
	const unitNum = event.url.searchParams.get('unitNum');

   return {form, unitNum};
})

export const actions:Actions = {
	default: async (event) =>{
		const form = await superValidate(event.request, zod(registerSchema))
		if(!form.valid){
			return fail(400, {form})
		}
		const { success, reset } = await ratelimit.register.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(form, `Please wait ${timeRemaining}s before trying again.`)
		}
		const validPass = form.data.password;
		const passStrength = zxcvbn(validPass);
		if(passStrength.score < 3) {
			return message(form, 'Please use a stronger password')
		}
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
		if(userAlreadyExists){
			return message(form, 'Email already in use, please login')
		}
		const user = await prisma.user.create({
			data:{ 
				email: validEmail, 
				passwordHash: hashedPass
			}
		});
		const verificationCode = await generateEmailVerificationRequest(user.id, user.email!);
		const sender = {
			name: 'computer@bransonschlegel.com',
			email: 'computer@bransonschlegel.com',
		}
		mailtrap.send({
			from:sender,
			to: [{email: user.email!}],
			subject: "Please verify your email",
			html: `testing: verification code: ${verificationCode}`
		}).catch((err) =>{
			console.log(err);
		})
		const session = await lucia.createSession(user.id, {});
		const sessionCookie = await lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.', 
			...sessionCookie.attributes
		});
		const unitNum = event.url.searchParams.get('unitNum');
		if(unitNum){
			
			redirect(302, `/register/emailVerification?unitNum=${unitNum}`);
		}
		redirect(302, `/register/emailVerification`);
	}
}