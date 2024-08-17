import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import prisma from "$lib/server/prisma";
import type { User } from "@prisma/client/edge";

export async function generateEmailVerificationRequest(userId:string, email: string): Promise<string> {
   await prisma.verifications.deleteMany({
      where: {
         id: userId,
      }
   })
   const code = generateRandomString(8, alphabet('0-9'));
   await prisma.verifications.create({
      data:{
         userId,
         email,
         code,
         expiresAt: createDate(new TimeSpan(15, 'm')),
      }
   })
   return code;
}

export async function verifyEmailVerificationRequest(user: User, code: string): Promise<boolean> {
   await prisma.ver
}