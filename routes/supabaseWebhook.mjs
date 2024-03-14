import express from "express";

import { getContactByEmail, deleteContactFromList } from "../helper/sendgrid_helper.mjs";
import { updateMemberStatusInNotion } from "../helper/notion_helper.mjs";
import { The100ClubListId } from "../helper/constants.mjs";


const router = express.Router();

router.post("/update-member-status", async (request, response) => {
    const prevMembershipLevel = request.body.old_record.membershipLevel
    const membershipLevel = request.body.record.membershipLevel
    
    const email = request.body.record.email
    console.log(email)
    const contactId = await getContactByEmail(email)
    console.log(contactId)
    
    if (membershipLevel === "ex-member" && prevMembershipLevel === "member") {
        console.log("Member churned")
        // await updateMemberStatusInNotion()
        await deleteContactFromList(The100ClubListId, contactId)
    }

    if (membershipLevel === "member" && prevMembershipLevel === "ex-member") {
        console.log("Member rejoined")
    }

    response.json({ received: true });
})

export default router;