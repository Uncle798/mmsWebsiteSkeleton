import prisma from '$lib/server/prisma'
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addressFormSchema } from '$lib/formSchemas/schemas';

import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
    const addressForm = await superValidate(zod(addressFormSchema));

    return { addressForm };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        if(!event.locals.user){
            redirect(302, '/login');
        }
        const addressForm = await superValidate(event.request, zod(addressFormSchema));
        if(!addressForm.valid){
            fail(400, {addressForm})
        }
        const address = addressForm.data
        const previousAddress = await prisma.contactInfo.findFirst({
            where: {
                userId: event.locals.user.id
            }
        })
        if(previousAddress){
            await prisma.contactInfo.update({
                where: {
                    contactId: previousAddress.contactId
                },
                data: {
                    softDelete: true
                }
            })
        }
        const dbAddress = await prisma.contactInfo.create({
            data: { ...address, userId: event.locals.user.id}
        });
        console.log(dbAddress);
        return { addressForm };
    }
};