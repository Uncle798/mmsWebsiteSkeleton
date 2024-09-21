import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  omit: {
    user: {
      passwordHash: true
    }
  }
});
export {
  prisma as p
};
