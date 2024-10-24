import { fail, redirect } from "@sveltejs/kit";
import { lucia } from '$lib/server/lucia';
import  prisma from "$lib/server/prisma";
import { mailtrap } from "$lib/server/mailtrap";
import { hash } from "@node-rs/argon2";
import {  registerFormSchema } from "$lib/formSchemas/schemas";
import { zxcvbn } from "@zxcvbn-ts/core";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationRequest } from "$lib/server/authUtils";
import { ratelimit } from "$lib/server/rateLimit";

export const load: PageServerLoad = (async (event) => {
   const registerForm = await superValidate(zod(registerFormSchema));
	const unitNum = event.url.searchParams.get('unitNum');

   return { registerForm, unitNum };
})

export const actions:Actions = {
	default: async (event) =>{
		const registerForm = await superValidate(event.request, zod(registerFormSchema));
		if(!registerForm.valid){
			return fail(400, registerForm)
		}
		const { success, reset } = await ratelimit.register.limit(event.getClientAddress())
		if(!success) {
			const timeRemaining = Math.floor((reset - Date.now()) /1000);
			return message(registerForm, `Please wait ${timeRemaining}s before trying again.`)
		}
		const validPass = registerForm.data.password;
		const passStrength = zxcvbn(validPass);
		if(passStrength.score < 3) {
			return message(registerForm, 'Please use a stronger password')
		}
		const validEmail = registerForm.data.email;
		const userAlreadyExists = await prisma.user.findUnique({
			where:{
				email: validEmail
			}
		})
		if(userAlreadyExists){
			return message(registerForm, 'Email already in use, please login')
		}
		const hashedPass = await hash(validPass, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
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
			console.error(err);
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