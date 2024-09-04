import { Prisma } from 'prisma/prisma-client'

export const partialUser = Prisma.validator<Prisma.UserDefaultArgs>()({
   select:{
      email: true,
      givenName: true,
      familyName: true, 
      organizationName: true,
   }
})

export type PartialUser = Prisma.UserGetPayload<typeof partialUser>