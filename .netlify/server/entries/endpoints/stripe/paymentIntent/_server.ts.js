import { s as stripe } from "../../../../chunks/stripe.js";
import { p as prisma } from "../../../../chunks/prisma.js";
const POST = async (event) => {
  const invoiceId = event.url.searchParams.get("invoiceId");
  if (invoiceId) {
    const invoice = await prisma.invoice.findUnique({
      where: {
        invoiceId
      }
    });
    if (invoice) {
      console.log(invoice);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: invoice.invoiceAmount * 100,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true
        }
      });
      return new Response(JSON.stringify(paymentIntent.client_secret), { status: 200 });
    }
  }
  return new Response(JSON.stringify("not found"), { status: 404 });
};
export {
  POST
};
