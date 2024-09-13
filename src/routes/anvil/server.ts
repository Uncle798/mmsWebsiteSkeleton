import prisma from '$lib/server/prisma';
import { dropbox } from '$lib/server/dropbox'
import { decryptRSA } from '@anvilco/encryption';
import { ANVIL_RSA_PRIVATE_KEY_BASE64 } from '$env/static/private';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

const key = Buffer.from(ANVIL_RSA_PRIVATE_KEY_BASE64, 'base64').toString('ascii');

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
   return json( {}, {status:200});
};