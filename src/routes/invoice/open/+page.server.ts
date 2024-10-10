import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load = (async () => {
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
    })
    return { invoices, customers };
}) satisfies PageServerLoad;