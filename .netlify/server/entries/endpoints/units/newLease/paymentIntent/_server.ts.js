import { s as stripe } from "../../../../../chunks/stripe.js";
import { j as json } from "../../../../../chunks/index.js";
const POST = async (event) => {
  const body = await event.request.json();
  if (body.price) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(body.price),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true
      }
    });
    return json({
      clientSecret: paymentIntent.client_secret
    });
  }
};
export {
  POST
};
