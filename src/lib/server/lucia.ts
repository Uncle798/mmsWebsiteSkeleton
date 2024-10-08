import { Lucia } from 'lucia';
import { PrismaAdapter }  from "@lucia-auth/adapter-prisma";
import  prisma  from "$lib/server/prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
   sessionCookie: {
      attributes: {
         secure: process.env.NODE_ENV === "production"
      }
   },
   getUserAttributes: (attributes) =>{
      return {
         email: attributes.email,
         employee: attributes.employee, 
         admin: attributes.admin,
         givenName: attributes.givenName,
         familyName: attributes.familyName,
         emailVerified: attributes.emailVerified,
         organizationName: attributes.organizationName
      }
   }
});

declare module 'lucia' {
   interface Register {
      Lucia: typeof lucia;
      DatabaseUserAttributes: DatabaseUserAttributes
   }
}

interface DatabaseUserAttributes {
   email: string;
   employee: boolean;
   admin: boolean;
   givenName: string;
   familyName: string;
   organizationName: string;
   emailVerified: boolean;
}