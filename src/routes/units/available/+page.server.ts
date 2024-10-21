import prisma from "$lib/server/prisma";

import type { PageServerLoad} from "../$types";
import type { Unit } from "@prisma/client";

export const load:PageServerLoad = (async () => {
   const units = await prisma.unit.findMany({
      orderBy: {
         num:'asc'
      }, 
      where: { 
            unavailable: false
      }
   })
   const leases = await prisma.lease.findMany({
      where: {
         leaseEnded: null
      }
   });
   const availableUnits:Unit[]=[];
   units.forEach((unit)=>{
      const lease = leases.find((l) => l.unitNum === unit.num);
      if(!lease){
         availableUnits.push(unit);
      }
   })
   return { availableUnits };
})
