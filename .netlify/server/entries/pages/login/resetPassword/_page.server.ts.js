import { p as prisma } from "../../../../chunks/prisma.js";
import { z } from "zod";
import "../../../../chunks/client.js";
import "../../../../chunks/formData.js";
import "../../../../chunks/index.js";
import { s as superValidate, z as zod, m as message } from "../../../../chunks/zod.js";
import "../../../../chunks/memoize.js";
import { p as passwordResetToken } from "../../../../chunks/authUtils.js";
import { r as ratelimit } from "../../../../chunks/redis.js";
import { m as mailtrap } from "../../../../chunks/mailtrap.js";
const forgotPassSchema = z.object({
  email: z.string().min(3).max(255).email().trim().toLowerCase()
});
const load = async () => {
  const form = await superValidate(zod(forgotPassSchema));
  return { form };
};
const actions = {
  default: async (event) => {
    const form = await superValidate(event.request, zod(forgotPassSchema));
    if (!form.valid) {
      return message(form, "Please use a valid email");
    }
    const { success, reset } = await ratelimit.register.limit(event.getClientAddress());
    if (!success) {
      const timeRemaining = Math.floor((reset - Date.now()) / 1e3);
      return message(form, `Please wait ${timeRemaining}s before trying again.`);
    }
    const user = await prisma.user.findUnique({
      where: {
        email: form.data.email
      }
    });
    if (!user) {
      return message(form, "An email will be sent to the email provided");
    }
    const verificationToken = await passwordResetToken(user.id);
    const verificationLink = "https://" + process.env.VERCEL_URL + verificationToken;
    const sender = { name: "Computer@bransonschlegel.com", email: "computer@bransonschlegel.com" };
    mailtrap.send({
      from: sender,
      to: [{ email: user.email }],
      subject: "Reset Password",
      html: `To reset the password please visit ${verificationLink}`
    });
    return message(form, "An email has been sent to the registered email address");
  }
};
export {
  actions,
  load
};
