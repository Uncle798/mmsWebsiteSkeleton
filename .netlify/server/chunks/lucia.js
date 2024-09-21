import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { p as prisma } from "./prisma.js";
const adapter = new PrismaAdapter(prisma.session, prisma.user);
const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production"
    }
  },
  getUserAttributes: (attributes) => {
    return {
      email: attributes.email,
      employee: attributes.employee,
      admin: attributes.admin,
      givenName: attributes.givenName,
      familyName: attributes.familyName,
      emailVerified: attributes.emailVerified,
      organizationName: attributes.organizationName
    };
  }
});
export {
  lucia as l
};
