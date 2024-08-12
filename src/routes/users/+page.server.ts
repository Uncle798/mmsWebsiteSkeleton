import prisma from "$lib/server/prisma";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import type { ContactInfo, Lease, User } from "@prisma/client";

export type TableData = User & ContactInfo & Lease

export const load:PageServerLoad = async ({locals }) =>{
   if(!locals.user){
      redirect(302, '/login');
   }
   const users = await prisma.user.findMany({
      orderBy: {
         familyName: 'asc'
      }, 
      where:{
         employee: false
      },
   });
   const leases = await prisma.lease.findMany()
   const contactInfo = await prisma.contactInfo.findMany({
      omit: {
         familyName: true,
         givenName: true,
      }
   });
   const data:TableData[] = [];
   users.forEach((user) =>{
      const lease = leases.find((lease) => lease.customerId === user.id);
      const contact = contactInfo.find((info) => info.email === user.email);
      const datum:TableData = {} as TableData;
      Object.assign(datum, user);
      Object.assign(datum, contact)
      Object.assign(datum, lease);
      data.push(datum);
   })
   return { data }
}