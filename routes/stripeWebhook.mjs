import express from "express";
import Stripe from "stripe";

// Live Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const router = express.Router();

// Match the raw body to content type application/json
router.post("/", async (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      console.log("PaymentMethod was attached to a Customer!");
      break;
    case "checkout.session.completed":
      console.log(event.data.object);
      console.log("Checkout Completed!");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});

export default router;
