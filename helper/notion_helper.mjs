import { Client } from '@notionhq/client'

const notion = new Client({
    auth: process.env.NOTION_TOKEN
})


const MEMBERS_DATABASE_ID = "60f11f4ed6c249fdaa06a8b4976f0c7f"
const PROFILES_DATABASE_ID = "9030f605b650435985c634bc471b0c5c"


export const updateNotionPageProperties = async (supabase_record) => {
    const filteredRows = async () => {
        const response = await notion.databases.query({
          database_id: PROFILES_DATABASE_ID,
          filter: {
            property: "id",
            title: {
                equals: supabase_record.id           
            }
          },
        });
      return response;
    }

    const response = await filteredRows()
    console.log(response)
    const notionPageId = response["results"][0]["id"]

    const updateNotionPageProperties = async (notionPageId) => {
        const response = await notion.pages.update({
          page_id: notionPageId,
          properties: {
            membershipLevel: {
              select: {
                  name: supabase_record.membershipLevel
              }
            }
          },
        });
        return response
    };

    const result = await updateNotionPageProperties(notionPageId)
    console.log(result)
    return result
}


export const addMemberToNotion = async (memberInfo) => {
  const response = await notion.pages.create({
    "parent": {
        "type": "database_id",
        "database_id": MEMBERS_DATABASE_ID
    },
    "properties": {
        "Name": {
            "title": [
                {
                    "text": {
                        "content": memberInfo.firstName
                    }
                }
            ]
        },
        "Email": {
            'email': memberInfo.email
        },
        "Status": {
            "select": {
                "name": "Onboarding"
            }
        }
    }
});
  console.log(response);

  if (response) { return response.url }
  else { return "" }
};