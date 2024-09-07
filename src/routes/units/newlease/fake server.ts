import prisma from '$lib/server/prisma';
import { dropbox } from '$lib/server/dropbox'
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async (event) => {
   const data = event.request.body;
   const eid = data.;
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
      }
   })
   return new Response();
};