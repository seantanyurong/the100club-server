import client from "@sendgrid/client";
import { The100ClubListId } from "./constants.mjs";


client.setApiKey(process.env.SENDGRID_API_KEY);


export const addContact = async () => {
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
}


export const getContactByEmail = async (email) => {
    const data = {
        "emails": [
          email
        ]
      };
      
      const request = {
        url: `/v3/marketing/contacts/search/emails`,
        method: 'POST',
        body: data
      }
      
      const contactId = await client.request(request)
        .then(([response, body]) => {
          console.log(response.statusCode);
          console.log(response.body);
          return response.body["result"][email]["contact"]["id"]
        })
        .catch(error => {
          console.error(error);
        });
      return contactId
}


export const deleteContactFromList = async (listId, contactId) => {
    const id = listId;
    const queryParams = {
      "contact_ids": contactId
    };
    
    const request = {
      url: `/v3/marketing/lists/${id}/contacts`,
      method: 'DELETE',
      qs: queryParams
    }
    
    client.request(request)
      .then(([response, body]) => {
        console.log(response.statusCode);
        console.log(response.body);
      })
      .catch(error => {
        console.error(error);
      });
}
