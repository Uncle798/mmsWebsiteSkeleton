import { f as fail, r as redirect } from "../../../chunks/index.js";
import { l as lucia } from "../../../chunks/lucia.js";
import { p as prisma } from "../../../chunks/prisma.js";
import { m as mailtrap } from "../../../chunks/mailtrap.js";
import { hash } from "@node-rs/argon2";
import { z } from "zod";
import { zxcvbn } from "@zxcvbn-ts/core";
import "../../../chunks/client.js";
import "../../../chunks/formData.js";
import { s as superValidate, z as zod, m as message } from "../../../chunks/zod.js";
import "../../../chunks/memoize.js";
import { g as generateEmailVerificationRequest } from "../../../chunks/authUtils.js";
import { r as ratelimit } from "../../../chunks/redis.js";
const registerSchema = z.object({
  email: z.string().email().min(3).max(255).trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password can't be longer than 255 characters"),
  passwordConfirm: z.string().min(6, "Password must be at least 6 characters").max(255, "Password can't be longer than 255 characters")
}).superRefine(({ password, passwordConfirm }, context) => {
  if (passwordConfirm !== password) {
    context.addIssue({
      code: "custom",
      message: "Password must match confirm password",
      path: ["password"]
    });
    context.addIssue({
      code: "custom",
      message: "Password must match confirm password",
      path: ["confirmPassword"]
    });
  }
});
const load = async (event) => {
  const form = await superValidate(zod(registerSchema));
  const unitNum = event.url.searchParams.get("unitNum");
  return { form, unitNum };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(registerSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const { success, reset } = await ratelimit.register.limit(event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again.`);
    }
    const validPass = form.data.password;
    const passStrength = zxcvbn(validPass);
    if (passStrength.score < 3) {
      return message(form, "Please use a stronger password");
    }
    const validEmail = form.data.email;
    const hashedPass = await hash(validPass, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        email: validEmail
      }
    });
    if (userAlreadyExists) {
      return message(form, "Email already in use, please login");
    }
    const user = await prisma.user.create({
      data: {
        email: validEmail,
        passwordHash: hashedPass
      }
    });
    const verificationCode = await generateEmailVerificationRequest(user.id, user.email);
    const sender = {
      name: "computer@bransonschlegel.com",
      email: "computer@bransonschlegel.com"
    };
    mailtrap.send({
      from: sender,
      to: [{ email: user.email }],
      subject: "Please verify your email",
      html: `testing: verification code: ${verificationCode}`
    }).catch((err) => {
      console.log(err);
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    const unitNum = event.url.searchParams.get("unitNum");
    if (unitNum) {
      redirect(302, `/register/emailVerification?unitNum=${unitNum}`);
    }
    redirect(302, `/register/emailVerification`);
  }
};
export {
  actions,
  load
};
