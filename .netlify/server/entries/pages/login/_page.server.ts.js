import { l as lucia } from "../../../chunks/lucia.js";
import { p as prisma } from "../../../chunks/prisma.js";
import { f as fail, r as redirect } from "../../../chunks/index.js";
import { verify } from "@node-rs/argon2";
import "../../../chunks/client.js";
import "../../../chunks/formData.js";
import { s as superValidate, z as zod, m as message } from "../../../chunks/zod.js";
import "../../../chunks/memoize.js";
import { z } from "zod";
import { r as ratelimit } from "../../../chunks/redis.js";
const loginSchema = z.object({
  email: z.string().email().min(3).max(255).trim(),
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password can't be longer than 255 characters").trim()
});
const load = async (event) => {
  const mess = event.url.searchParams.get("message");
  const form = await superValidate(zod(loginSchema));
  return { form, mess };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(loginSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const validEmail = form.data.email;
    const validPass = form.data.password;
    const { success, reset } = await ratelimit.login.limit(event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again.`);
    }
    const user = await prisma.user.findFirst({
      where: {
        email: validEmail
      },
      omit: {
        passwordHash: false
      }
    });
    if (!user) {
      return message(form, "Invalid username or password");
    }
    const checkedPass = await verify(user.passwordHash, validPass, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    if (!checkedPass) {
      return message(form, "Invalid username or password");
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    const redirectTo = event.url.searchParams.get("redirectTo");
    const unitNum = event.url.searchParams.get("unitNum");
    if (redirectTo) {
      redirect(302, `${redirectTo.slice(1)}`);
    }
    if (unitNum) {
      redirect(302, `units/newLease?unitNum=${unitNum}`);
    }
    redirect(302, "/");
  }
};
export {
  actions,
  load
};
