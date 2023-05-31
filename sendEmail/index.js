const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
const Handlebars = require("handlebars");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { readFile } = require("fs/promises");

const domain = process.env.DOMAIN;
if (!domain) {
  throw new Error("DOMAIN is required");
}

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  defaultProvider,
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

/**
 *
 * @param {
 *  name: string
 *  email: string
 * } event
 */
const handler = async (event) => {
  console.log("event", event);
  const name = event.name;
  const email = event.email;

  const template = await readFile("sendEmail/template.hbs", "utf8");
  const compiled = Handlebars.compile(template);
  const html = compiled({ name: name, useremail: email });
  const config = {
    from: {
      address: `hello@${domain}`,
      name: "My Company",
    },
    to: {
      address: email,
      name: name,
    },
    replyTo: {
      address: `contact@${domain}`,
      name: "Contact Company",
    },
    subject: "Message using AWS SES",
    text: "I hope this message gets sent!",
    html,
    list: {
      unsubscribe: {
        url: `${domain}/unsubscribe?email=${encodeURIComponent(email)}`,
        comment: "Unsubscribe from this",
      },
    },
  };
  console.log("config", config);
  const result = await transporter.sendMail(config);
  console.log(result);
};

module.exports = {
  handler,
};
