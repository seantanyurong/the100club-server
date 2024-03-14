import client from "@sendgrid/client";


client.setApiKey(process.env.SENDGRID_API_KEY);


export const addContact = async () => {
    const contact = {
        list_ids: ["e8d3e60b-904f-44de-b146-b968aa539e5c"],
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
      
      client.request(request)
        .then(([response, body]) => {
          console.log(response.statusCode);
          console.log(response.body);
          const contactId = response.body["result"][email]["contact"]["id"]
          return contactId
        })
        .catch(error => {
          console.error(error);
        });
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
