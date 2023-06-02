// DEPLOY:    sls deploy -f sendEmail --verbose
// LOGS:      sls logs -f sendEmail  -t
// BOTH:      sls deploy -f sendEmail --verbose && sls logs -f sendEmail  -t

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import Handlebars from "handlebars";
import template from "./template.hbs";
const { REGION, EMAIL_DOMAIN } = process.env;
if (!EMAIL_DOMAIN) {
  throw new Error("EMAIL_DOMAIN is required");
}
if (!REGION) {
  throw new Error("REGION is required");
}

// Our expected inputs
interface iEvent {
  name: string;
  email: string;
  subject: string;
}

export const handler = async (event: iEvent) => {

  try {
    const sesClient = new SESClient({ region: REGION });
    const { name, email, subject } = event;

    // Compile HTML with Handlebars
    const compiled = Handlebars.compile(template);
    const htmlMessage = compiled({ username: name, useremail: email });

    // Set our source and replyTo addresses
    const source = `hello@${EMAIL_DOMAIN}`;
    const replyTo = `contact@${EMAIL_DOMAIN}`;

    const command = new SendEmailCommand({
      Source: source,
      Destination: {
        ToAddresses: [email], // Please note: if in Sandbox mode, this must be a verified email address
      },
      Message: {
        Subject: { Data: subject },
        Body: { 
          Html: {
            Charset: "UTF-8",
            Data: htmlMessage,
          },
          Text: {
            Charset: "UTF-8",
            Data: "Please view this email in a client that supports HTML",
          },
        },
      },
      ReplyToAddresses: [replyTo],
    });
    await sesClient.send(command);
    // You should have been sent the email by now!!

  } catch (error: any) {
    console.log("❌ Error sending email:", error);
    throw new Error("❌ Error sending email:", error);
  }
};
