import { p as prisma } from "../../../../chunks/prisma.js";
import { r as redirect } from "../../../../chunks/index.js";
import { h as handleLoginRedirect } from "../../../../chunks/utils.js";
const load = async (event) => {
  if (!event.locals.user) {
    throw redirect(302, handleLoginRedirect(event));
  }
  if (event.locals.user.employee) {
    const dbUser = await prisma.user.findUnique({
      where: {
        id: event.locals.user.id
      }
    });
    const contactInfos = await prisma.contactInfo.findMany({
      where: {
        userId: dbUser?.id
      }
    });
    return { dbUser, contactInfos };
  }
};
export {
  load
};
