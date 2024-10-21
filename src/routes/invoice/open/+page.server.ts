import prisma from '$lib/server/prisma';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { paymentRecordSchema } from '$lib/formSchemas/schemas';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    const newPaymentForm = await superValidate(zod(paymentRecordSchema), {id: 'newPayment'})
    const invoices = await prisma.invoice.findMany({
        where: {
            invoicePaid: null
        }
    });
    const customers = await prisma.user.findMany({
        where:{
            customerInvoices: {
                some: {
                    invoicePaid: null
                }
            }
        }
    });
    const leases = await prisma.lease.findMany()
    return { invoices, customers, newPaymentForm, leases };
}) satisfies PageServerLoad;