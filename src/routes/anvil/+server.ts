import prisma from '$lib/server/prisma';
import { dropbox } from '$lib/server/dropbox'
import { decryptRSA } from '@anvilco/encryption';
import { ANVIL_RSA_PRIVATE_KEY_BASE64, ANVIL_WEBHOOK_TOKEN } from '$env/static/private';
import type { RequestHandler } from './$types';

const key = Buffer.from(ANVIL_RSA_PRIVATE_KEY_BASE64, 'base64').toString('ascii');

export const POST: RequestHandler = async (event) => {
   const data = await event.request.json();
   if(data.token === ANVIL_WEBHOOK_TOKEN){
      const decrypted = decryptRSA(key, data.data);
      console.log(decrypted);
      if(decrypted.etchPacket.completedAt){
         const lease = await prisma.lease.update({
            where: {
               anvilEID:String(decrypted.etchPacket.eid),
            },
            data: {
               leaseReturnedAt: decrypted.etchPacket.completedAt,
            }
         })
         if(!lease?.dropboxURL){
            const downloadURL = decrypted.documentGroup.files[0].downloadURL;

            const dropboxResult = await dropbox.filesSaveUrl({
               url:downloadURL,
               path: ''
            })
            console.log('anvil/server ' + dropboxResult.result);
         }
      }
   }
   return new Response(JSON.stringify('ok'), {status: 200});
}