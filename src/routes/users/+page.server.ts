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
      include:{
         customerLeases: true,
         employeeLeases: true,
         contactInfo: true,
      }
   });
   const flattenObject = (obj: any, prefix = '.') =>{
      const flattened: any = {}
      Object.keys((obj)).forEach((key) => {
         if(typeof obj[key] === 'object' && obj[key] !== null){
            Object.assign(flattened, flattenObject(obj[key], prefix));
         } else {
            flattened[prefix+key] = obj[key]
         }
      });
      return flattened
   }
   const data = flattenObject(users.slice(0,2), '.');
   console.log(data);
   return { data }
}