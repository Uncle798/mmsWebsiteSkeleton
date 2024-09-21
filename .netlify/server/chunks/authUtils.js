import { createDate, TimeSpan, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet, sha256 } from "oslo/crypto";
import { p as prisma } from "./prisma.js";
import { generateIdFromEntropySize } from "lucia";
import { encodeHex } from "oslo/encoding";
async function generateEmailVerificationRequest(userId, email) {
  await prisma.verification.deleteMany({
    where: {
      id: userId
    }
  });
  const code = generateRandomString(8, alphabet("0-9"));
  await prisma.verification.create({
    data: {
      userId,
      email,
      code,
      expiresAt: createDate(new TimeSpan(15, "m"))
    }
  });
  return code;
}
async function verifyEmailVerificationRequest(userId, userEmail, code) {
  const dbVerification = await prisma.verification.findUnique({
    where: {
      id: userId
    }
  });
  if (!dbVerification || dbVerification?.code !== code) {
    return false;
  } else if (!isWithinExpirationDate(dbVerification.expiresAt)) {
    return false;
  } else if (dbVerification.email !== userEmail) {
    return false;
  }
  return true;
}
async function passwordResetToken(userId) {
  const tokenId = generateIdFromEntropySize(25);
  const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  await prisma.passwordReset.create({
    data: {
      tokenHash,
      userId,
      expiresAt: createDate(new TimeSpan(2, "h"))
    }
  });
  return tokenId;
}
export {
  generateEmailVerificationRequest as g,
  passwordResetToken as p,
  verifyEmailVerificationRequest as v
};
