import { l as lucia } from "../../../../chunks/lucia.js";
import { p as prisma } from "../../../../chunks/prisma.js";
import { z } from "zod";
import "../../../../chunks/client.js";
import "../../../../chunks/formData.js";
import { r as redirect } from "../../../../chunks/index.js";
import { s as superValidate, z as zod, m as message } from "../../../../chunks/zod.js";
import "../../../../chunks/memoize.js";
import { v as verifyEmailVerificationRequest } from "../../../../chunks/authUtils.js";
import { h as handleLoginRedirect } from "../../../../chunks/utils.js";
import { r as ratelimit } from "../../../../chunks/redis.js";
const emailVerifySchema = z.object({
  code: z.string().min(8).max(8).trim()
});
const load = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, handleLoginRedirect(event));
  }
  const form = await superValidate(zod(emailVerifySchema));
  return { form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(emailVerifySchema));
    if (!form.valid) {
      return message(form, "Code must be 8 characters");
    }
    const { success, reset } = await ratelimit.login.limit(event.locals.user?.id ?? event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again`);
    }
    const { user } = event.locals;
    if (user) {
      const emailVerified = await verifyEmailVerificationRequest(user?.id, user?.email, form.data.code);
      if (emailVerified) {
        await lucia.invalidateUserSessions(user.id);
        const dbUser = await prisma.user.update({
          where: {
            id: user.id
          },
          data: {
            emailVerified: true
          }
        });
        const session = await lucia.createSession(dbUser.id, {});
        const sessionCookie = await lucia.createSessionCookie(session.id);
        event.cookies.set(sessionCookie.name, sessionCookie.value, {
          path: ".",
          ...sessionCookie.attributes
        });
      }
    }
    const redirectTo = event.url.searchParams.get("redirectTo");
    const unitNum = event.url.searchParams.get("unitNum");
    if (redirectTo) {
      redirect(302, `${redirectTo.slice(1)}`);
    }
    if (unitNum) {
      redirect(302, "/register/addressForm?unitNum=" + unitNum);
    }
    redirect(302, "/register/addressForm");
  }
};
export {
  actions,
  load
};
