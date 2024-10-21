import prisma from "$lib/server/prisma";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
   
   const invoice = await prisma.invoice.findUnique({
      where: {
         invoiceId: event.params.invoiceId
      }
   });
   return { invoice }
};