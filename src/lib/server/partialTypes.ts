import { Prisma } from "@prisma/client/edge"

export const partialUser = Prisma.validator<Prisma.UserDefaultArgs>()({
   select:{
      email: true,
      givenName: true,
      familyName: true, 
      organizationName: true,
      id: true,
      employee: true,
      admin: true,
   }
})

export type PartialUser = Prisma.UserGetPayload<typeof partialUser>
