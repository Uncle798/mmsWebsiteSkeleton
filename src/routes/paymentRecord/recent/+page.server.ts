import prisma from '$lib/server/prisma';

import type { PageServerLoad } from './$types';

export const load = (async () => {

   const paymentRecords = await prisma.paymentRecord.findMany({
      take: 25,
      orderBy: {
         paymentCreated: 'desc'
      },
      where: {
         paymentType: {
            not: 'STRIPE'
         }
      }
   })
    return { paymentRecords };
}) satisfies PageServerLoad;