import prisma from '$lib/server/prisma';
import { superValidate, message } from 'sveltekit-superforms';
import type { PageServerLoad, Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { ratelimit } from '$lib/server/rateLimit';
import { nameFormSchema } from '$lib/formSchemas/schemas';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
   default: async (event) =>{
      const nameForm = await superValidate(event.request, zod(nameFormSchema));
      const { success, reset } = await ratelimit.login.limit(event.locals.user?.id ?? event.getClientAddress());
      if(!success){
         const timeRemaining = Math.floor((reset - Date.now()) / 1000);
         return message(nameForm, `Please wait ${timeRemaining}s before trying again`);
      };
      const user = await prisma.user.update({
         where: {
            id: event.locals.user?.id
         },
         data: {
            givenName: nameForm.data.givenName,
            familyName: nameForm.data.familyName,
         }
      });
      console.log(user)
      return { nameForm }
   }
};