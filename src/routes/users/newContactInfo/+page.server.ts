import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { handleLoginRedirect } from '$lib/utils';

export const load = (async (event) => {
   if(!event.locals.user){
      throw redirect(302, handleLoginRedirect(event))
   }
   if(event.locals.user.employee){
      const dbUser = await prisma.user.findUnique({
         where: {
            id: event.locals.user.id
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