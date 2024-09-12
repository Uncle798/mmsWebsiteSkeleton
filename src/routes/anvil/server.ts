import prisma from '$lib/server/prisma';
import { dropbox } from '$lib/server/dropbox'
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async (event) => {
   const data = event.request.body;
   console.log(data);
   const eid = data.eid;
   const lease = await prisma.lease.findFirst({
      where: {
         anvilEID:eid,
      }
   })
   if(!lease?.dropboxURL){
      const downloadURL = data.documentGroup.files[0].downloadURL;
      const dropboxResult = await dropbox.filesSaveUrl({
         url:downloadURL,
         path: ''
      })
   
      await prisma.lease.update({
         where:{
            leaseId: eid,
         },
         data: {
            leaseReturnedAt:data.updatedAt,
            dropboxURL: dropboxResult.result
         }
      })
   }
   return new Response();
};