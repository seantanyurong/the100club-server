import { Client } from '@notionhq/client'

const notion = new Client({
    auth: process.env.NOTION_TOKEN
})


const MEMBERS_DATABASE_ID = "60f11f4ed6c249fdaa06a8b4976f0c7f"
const PROFILES_DATABASE_ID = "9030f605b650435985c634bc471b0c5c"


const checkUndefindOrNull = (value) => {
  if (value === undefined || value === null) {
    return ""
  }
  return value
}


export const updateNotionPageProperties = async (supabase_record) => {
    const filteredRows = async () => {
        const response = await notion.databases.query({
          database_id: PROFILES_DATABASE_ID,
          filter: {
            property: "id",
            rich_text: {
                equals: supabase_record.id           
            }
          },
        });
      return response;
    }

    const updateNotionPageProperties = async (notionPageId) => {
        const response = await notion.pages.update({
          page_id: notionPageId,
          properties: {
            membershipLevel: {
              select: {
                  name: supabase_record.membershipLevel
              }
            },
            email: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.email)
                  }
                }
              ]
            },
            companyLink: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.companyLink)
                  }
                }
              ]
            },
            fullName: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.fullName)
                  }
                }
              ]
            },
            companyName: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.companyName)
                  }
                }
              ]
            },
            companyAbout: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.companyAbout)
                  }
                }
              ]
            },
            revenue: {
              rich_text: [
                {
                  text: {
                    content: checkUndefindOrNull(supabase_record.revenue)
                  }
                }
              ]
            },
            totalFunding: {
              number: supabase_record.totalFunding
            }
          },
        });
        return response
    };

    try {
      const response = await filteredRows()
      console.log("Finding Notion page...")
      const notionPageId = response["results"][0]["id"]
      const result = await updateNotionPageProperties(notionPageId)
      console.log("Updating Notion page properties...")
      return result
    } catch (error) {
      console.error('An error occurred:', error.message)
    }
}


export const insertNotionPage = async (supabase_record) => {
  try {
    const response = await notion.pages.create({
      parent: {
          database_id: PROFILES_DATABASE_ID
      },
      properties: {
          id: {
            rich_text: [
              {
                text: {
                  content: supabase_record.id
                }
              }
            ]
          },
          email: {
            rich_text: [
              {
                text: {
                  content: checkUndefindOrNull(supabase_record.email)
                }
              }
            ]
          },
      }
    });
    console.log("Creating Notion Page...");
    return response
  } catch (error) {
    console.error('An error occurred:', error.message)
  }
};


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