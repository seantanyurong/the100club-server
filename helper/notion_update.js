import { Client } from '@notionhq/client'

const notion = new Client({
    auth: process.env.NOTION_TOKEN
})


const MEMBERS_DATABASE_ID = "60f11f4ed6c249fdaa06a8b4976f0c7f"


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