
// DEPLOY:    sls deploy -f sendEmail --verbose 
// LOGS:      sls logs -f sendEmail  -t
// BOTH:      sls deploy -f sendEmail --verbose && sls logs -f sendEmail  -t

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { readFile }  from "fs/promises";
import Handlebars from "handlebars";

const { REGION, DOMAIN } = process.env;
if (!DOMAIN) { throw new Error("DOMAIN is required");}
if (!REGION) { throw new Error("REGION is required");}



// Our expected inputs
interface iEvent {
  name: string;
  email: string;
  subject: string;
}


export const handler = async (event : iEvent) => {
  console.log("event", event);

  try {

    const { name, email, subject } = event;

    const sesClient = new SESClient({ region: REGION });
    
    const template = await readFile("src/template.hbs", "utf8");
    const compiled = Handlebars.compile(template);
    const htmlMessage = compiled({ name: name, useremail: email });

    const source = `hello@${DOMAIN}`;


    const command = new SendEmailCommand({
      Source: source,
        Destination: {
          ToAddresses: [email],
        },
        Message: {
          Subject: { Data: subject },
          Body: { Text: { Data: htmlMessage } },
        },
        ReplyToAddresses: [`contact@${DOMAIN}`],
    });


    console.log("📧 command", command);
    const result = await sesClient.send(command);
    console.log("📧 result", result);
  } catch (error : any) {
    console.log('❌ Error sending email:', error);
  }
};


