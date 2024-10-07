import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
const paymentRecordSchema = z.object({
   customerId: z.string(),
   
})
export const load = (async () => {
   const form = await superValidate(zod(paymentRecordSchema))
   return { form, };
}) satisfies PageServerLoad;