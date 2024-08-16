import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({locals}) => {
   if(!locals.user){
      redirect(302, '/login')
   }
   if(locals.user.employee){
      const dbUser = await prisma.user.findUnique({
         where: {
            id: locals.user.id
         }
      })
      const contactInfos = await prisma.contactInfo.findMany({
         where:{
            userId: dbUser?.id,
         }
      })
      return { dbUser, contactInfos};
   }
}) satisfies PageServerLoad;