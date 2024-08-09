import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load:PageServerLoad = async ({locals }) =>{
   if(!locals.user){
      redirect(302, '/login');
   }
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }
   });
   const contactInfos = await prisma.contactInfo.findMany({
      where:{
         softDelete: false
      }
   })
   return { users, contactInfos }
}