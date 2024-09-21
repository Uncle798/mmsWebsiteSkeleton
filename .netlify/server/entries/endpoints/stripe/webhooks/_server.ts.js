import { s as stripe, S as STRIPE_SIGNING_SECRET } from "../../../../chunks/stripe.js";
const POST = async (event) => {
  {
    const signature = event.request.headers.get("stripe-signature");
    let stripeEvent;
    if (signature) {
      try {
        const body = await event.request.text();
        stripeEvent = stripe.webhooks.constructEvent(
          body,
          signature,
          STRIPE_SIGNING_SECRET
        );
      } catch (err) {
        console.error(err);
      }
      switch (stripeEvent?.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = stripeEvent.data.object;
          console.log("stripe webhooks " + paymentIntent);
          break;
        }
      }
    }
  }
  return new Response(JSON.stringify("ok"), { status: 200 });
};
export {
  POST
};
