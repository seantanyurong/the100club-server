import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import stripeWebhook from "./routes/stripeWebhook.mjs";
import supabaseWebhook from "./routes/supabaseWebhook.mjs";


const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/stripeWebhook", stripeWebhook);
app.use("/supabaseWebhook", supabaseWebhook);

// starting the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
