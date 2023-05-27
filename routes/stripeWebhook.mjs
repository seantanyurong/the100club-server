import express from "express";
import Stripe from "stripe";
// import { supabase } from "../supabaseApi.js";
// import sgMail from "@sendgrid/mail";
// import client from "@sendgrid/client";

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
    case "checkout.session.completed":
      const eventData = event.data.object;
      const customerData = event.data.object.customer_details;
      const customerEmail = customerData.email;
      const customerFirstName = event.data.object.custom_fields[0].text.value;

      console.log("EMAIL " + customerEmail);
      console.log("NAME " + customerFirstName);

      console.log(eventData);

      // // Create user in supabase
      // const userEmail = eventData.customer_details.email;
      // const { data, error1 } = await supabase.auth.signUp({
      //   email: "seantanyurong@gmail.com",
      //   password: "password",
      // });

      // console.log(data);
      // console.log(data.user.id);

      // // Add user to profile table
      // const { error2 } = await supabase.from("profiles").insert({
      //   id: data.user.id,
      //   email: "seantanyurong@gmail.com",
      //   membershipLevel: "member",
      // });

      // // Add user to sendgrid database list
      // client.setApiKey(process.env.SENDGRID_API_KEY);
      // const contact = {
      //   list_ids: ["e8d3e60b-904f-44de-b146-b968aa539e5c"],
      //   contacts: [
      //     {
      //       email: "seantanyurong@gmail.com",
      //       first_name: "Sean",
      //       custom_fields: {
      //         e1_T: "member",
      //       },
      //     },
      //   ],
      // };

      // const requestAddContact = {
      //   url: `/v3/marketing/contacts`,
      //   method: "PUT",
      //   body: contact,
      // };

      // client
      //   .request(requestAddContact)
      //   .then(([response, body]) => {
      //     console.log(response.statusCode);
      //     console.log(response.body);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });

      // // User data
      // const msg = {
      //   to: "seantanyurong@gmail.com",
      //   from: "hello@the100club.io",
      //   templateId: "d-899eb8f026434e62b3207cf67620dbcb",
      //   dynamicTemplateData: {
      //     first_name: "Sean",
      //     email: "seantanyurong@gmail.com",
      //   },
      // };

      // // Send user onboarding email
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // sgMail.send(msg);

      console.log("Checkout Completed!");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});

export default router;
