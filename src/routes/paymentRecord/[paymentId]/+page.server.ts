import prisma from '$lib/server/prisma'
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
   const paymentId = event.params.paymentId;
   const paymentRecord = await prisma.paymentRecord.findUnique({
      where: {
         paymentId
      } 
   })
    return { paymentRecord, };
}) satisfies PageServerLoad;