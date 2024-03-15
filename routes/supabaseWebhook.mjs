import express from "express";

import { getContactByEmail, deleteContactFromList } from "../helper/sendgrid_helper.mjs";
import { The100ClubListId } from "../helper/constants.mjs";
import { updateNotionPageProperties } from "../helper/notion_helper.mjs";


const router = express.Router();

router.post("/update-member-status", async (request, response) => {
    console.log(request)
    const prevMembershipLevel = request.body.old_record.membershipLevel
    const membershipLevel = request.body.record.membershipLevel
    
    const email = request.body.record.email
    console.log(email)
    const contactId = await getContactByEmail(email)
    console.log(contactId)
    
    if (membershipLevel === "ex-member" && prevMembershipLevel === "member") {
        console.log("Member churned")
        await deleteContactFromList(The100ClubListId, contactId)
    }

    if (membershipLevel === "member" && prevMembershipLevel === "ex-member") {
        console.log("Member rejoined")
    }

    response.json({ received: true });
})


router.post("/sync-with-notion", async (request, response) => {
    const payloadType = request.body.type
    const record = request.body.record

    console.log("RECORD: ")
    console.log(record)

    switch (payloadType) {
        case "INSERT":
            console.log("Inserting Notion page...")
            break;

        case "UPDATE":
            console.log("Updating Notion page...")
            await updateNotionPageProperties(record)
            break;

        default:
            console.log(`Unhandled event type ${payloadType}`);
    }

    response.json({ received: true });
})


export default router;