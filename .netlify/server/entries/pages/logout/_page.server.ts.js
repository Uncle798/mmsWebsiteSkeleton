import { l as lucia } from "../../../chunks/lucia.js";
import { f as fail, r as redirect } from "../../../chunks/index.js";
const load = async ({ locals }) => {
};
const actions = {
  default: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = await lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes
    });
    redirect(302, "/login");
  }
};
export {
  actions,
  load
};
