import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet, sha256 } from "oslo/crypto";
import { isWithinExpirationDate } from "oslo";
import prisma from "$lib/server/prisma";
import { generateIdFromEntropySize } from "lucia";
import { encodeHex } from "oslo/encoding";

export async function generateEmailVerificationRequest(userId:string, email: string): Promise<string> {
   await prisma.verification.deleteMany({
      where: {
         id: userId,
      }
   })
   const code = generateRandomString(8, alphabet('0-9'));
   await prisma.verification.create({
      data:{
         userId,
         email,
         code,
         expiresAt: createDate(new TimeSpan(15, 'm')),
      }
   })
   return code;
}

export async function verifyEmailVerificationRequest(userId: string, userEmail: string, code: string): Promise<boolean> {
   const dbVerification = await prisma.verification.findUnique({
      where:{
         id:userId,
      }
   });
   if(!dbVerification || dbVerification?.code !== code) {
      return false;
   } else if (!isWithinExpirationDate(dbVerification.expiresAt)) {
      return false;
   } else if (dbVerification.email !== userEmail) {
      return false
   }
   return true;
}

export async function passwordResetToken(userId: string): Promise<string> {
   const tokenId = generateIdFromEntropySize(25);
   const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
   await prisma.
}