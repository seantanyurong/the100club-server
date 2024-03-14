import express from "express";
import Stripe from "stripe";
import { supabase } from "../supabaseApi.js";
import sgMail from "@sendgrid/mail";
import client from "@sendgrid/client";

import { send_notification_telegram } from "../helper/notification.js";
import { addMemberToNotion } from "../helper/notion_helper.mjs";
import { The100ClubListId } from "../helper/constants.mjs";

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
      const customerData = eventData.customer_details;
      const customerEmail = customerData.email;
      const customerFirstName = event.data.object.custom_fields[0].text.value;

      console.log("EMAIL " + customerEmail);
      console.log("NAME " + customerFirstName);

      // // Create user in supabase
      // const { data, error1 } = await supabase.auth.signUp({
      //   email: customerEmail,
      //   password: "password",
      // });

      // console.log("DATA", data);
      // console.log("ERROR1", error1);

      // // Add user to profile table
      // const { data: createData, error2 } = await supabase
      //   .from("profiles")
      //   .insert({
      //     id: data.user.id,
      //     email: customerEmail,
      //     membershipLevel: "member",
      //   })
      //   .select();

      // console.log("ERROR2", error2);
      // console.log("createData", createData);
      // // Add user to sendgrid database list
      // client.setApiKey(process.env.SENDGRID_API_KEY);
      // const contact = {
      //   list_ids: [The100ClubListId],
      //   contacts: [
      //     {
      //       email: customerEmail,
      //       first_name: customerFirstName,
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
      //   to: customerEmail,
      //   from: "hello@the100club.io",
      //   templateId: "d-899eb8f026434e62b3207cf67620dbcb",
      //   dynamicTemplateData: {
      //     first_name: customerFirstName,
      //     email: customerEmail,
      //   },
      // };

      // // Send user onboarding email
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // sgMail.send(msg);

      // console.log("Checkout Completed!");

      // Check if user exsists
      let { data: userExists, error } = await supabase
        .from("profiles")
        .select(`id, email`)
        .eq("email", customerEmail)
        .single();

      console.log("USER EXISTS", userExists);

      let newCustomer = false;
      let supabaseUpdateSuccess = false;
      let sendgridListSuccess = false;
      let sendgridSendEmailSuccess = false;

      if (userExists) {
        const { error2 } = await supabase.from("profiles").upsert({
          id: userExists.id,
          email: customerEmail,
          membershipLevel: "member+mentor",
        });

        if (!error2) supabaseUpdateSuccess = true;

        // Add user to sendgrid database list
        client.setApiKey(process.env.SENDGRID_API_KEY);
        const contact = {
          list_ids: [The100ClubListId],
          contacts: [
            {
              email: customerEmail,
              first_name: customerFirstName,
              custom_fields: {
                e1_T: "member",
              },
            },
          ],
        };

        const requestAddContact = {
          url: `/v3/marketing/contacts`,
          method: "PUT",
          body: contact,
        };

        await client
          .request(requestAddContact)
          .then(([response, body]) => {
            console.log(response.statusCode);
            console.log(response.body);
            sendgridListSuccess = true;
          })
          .catch((error) => {
            console.error(error);
          });

        // User data
        const msg = {
          to: customerEmail,
          from: "hello@the100club.io",
          templateId: "d-209500e2dfd843f289f68a014ce4b734",
          dynamicTemplateData: {
            first_name: customerFirstName,
            email: customerEmail,
          },
        };

        // Send user onboarding email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(msg)
          .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
            sendgridSendEmailSuccess = true
          })
          .catch((error) => {
            console.error(error)
          });
      } else {
        newCustomer = true;

        // Create user in supabase
        const { data: userData, error1 } = await supabase.auth.signUp({
          email: customerEmail,
          password: "password",
        });

        console.log("USER EXISTS", userData);

        // Add user to profile table
        const { error2 } = await supabase.from("profiles").insert({
          id: userData.user.id,
          email: customerEmail,
          membershipLevel: "member",
        });

        if (!error1 && !error2) supabaseUpdateSuccess = true;

        // Add user to sendgrid database list
        client.setApiKey(process.env.SENDGRID_API_KEY);
        const contact = {
          list_ids: [The100ClubListId],
          contacts: [
            {
              email: customerEmail,
              first_name: customerFirstName,
              custom_fields: {
                e1_T: "member",
              },
            },
          ],
        };

        const requestAddContact = {
          url: `/v3/marketing/contacts`,
          method: "PUT",
          body: contact,
        };

        await client
          .request(requestAddContact)
          .then(([response, body]) => {
            console.log(response.statusCode);
            console.log(response.body);
            sendgridListSuccess = true;
          })
          .catch((error) => {
            console.error(error);
          });

        // User data
        const msg = {
          to: customerEmail,
          from: "hello@the100club.io",
          templateId: "d-899eb8f026434e62b3207cf67620dbcb",
          dynamicTemplateData: {
            first_name: customerFirstName,
            email: customerEmail,
          },
        };

        // Send user onboarding email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(msg)  
          .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
            sendgridSendEmailSuccess = true;
          })
          .catch((error) => {
            console.error(error)
          });
      }

      console.log("Checkout Completed!");

      const memberInfo = {
        'firstName': customerFirstName,
        'email': customerEmail
      }

      const page_url = await addMemberToNotion(memberInfo)

      const notification_message = `
${newCustomer ? 'NEW ' : ''}Customer: ${customerFirstName} - ${customerEmail}
${supabaseUpdateSuccess ? '✔️' : '❌'} Customer profile updated in Supabase
${sendgridListSuccess ? '✔️' : '❌'} Customer email added to SendGrid mailing list
${sendgridSendEmailSuccess ? '✔️' : '❌'} Customer sent onboarding email

${page_url.length !== 0 ? '✔️' : '❌' } Notion page created: ${page_url}
      `
      await send_notification_telegram(notification_message)

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});

export default router;
