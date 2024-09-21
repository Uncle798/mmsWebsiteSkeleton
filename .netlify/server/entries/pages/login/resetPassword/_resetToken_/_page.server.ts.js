import { l as lucia } from "../../../../../chunks/lucia.js";
import { p as prisma } from "../../../../../chunks/prisma.js";
import { hash } from "@node-rs/argon2";
import { z } from "zod";
import "../../../../../chunks/client.js";
import "../../../../../chunks/formData.js";
import { r as redirect } from "../../../../../chunks/index.js";
import { s as superValidate, z as zod, m as message } from "../../../../../chunks/zod.js";
import "../../../../../chunks/memoize.js";
import { isWithinExpirationDate } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { r as ratelimit } from "../../../../../chunks/redis.js";
const passwordResetSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters").max(255, "Password can't be longer than 255 characters").trim(),
  passwordConfirm: z.string().min(6, "Password must be at least 6 characters").max(255, "Password can't be longer than 255 characters").trim()
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
  const form = await superValidate(event.request, zod(passwordResetSchema));
  return { form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(passwordResetSchema));
    if (!form.valid) {
      return message(form, "Invalid form data");
    }
    const { success, reset } = await ratelimit.register.limit(event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again.`);
    }
    const verificationToken = event.params.resetToken;
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)));
    const dbToken = await prisma.passwordReset.findFirst({
      where: {
        tokenHash
      }
    });
    if (dbToken) {
      await prisma.passwordReset.delete({
        where: {
          tokenHash
        }
      });
    }
    if (!dbToken || !isWithinExpirationDate(dbToken.expiresAt)) {
      return redirect(302, "/login/resetPassword");
    }
    await lucia.invalidateSession(dbToken.userId);
    const passwordHash = await hash(form.data.password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    const dbUser = await prisma.user.update({
      where: {
        id: dbToken.userId
      },
      data: {
        passwordHash
      }
    });
    const session = await lucia.createSession(dbUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    redirect(302, "/");
  }
};
export {
  actions,
  load
};
