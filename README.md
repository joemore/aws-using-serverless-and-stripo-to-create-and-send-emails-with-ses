# How it works

This will create a SES service with a domain and a subdomain. It will also create a IAM role for the lambda function to use.

* SES
* Lambda

## Important Note 1 - If you already have a domain setup in AWS, SES

In `serverless.yml` - Comment out the entire `resources:` block, otherwise it will try and setup your domain in SES and register the DKIM keys (which it will simply fail to deploy... it's not destructive! Phew!)

## Important Note 2 - If your SES account is in Sandbox mode

Any email address you send to must be verified. You can verify an email address in the AWS console.

### Getting started  

Copy (or rename) `.env.example` to `.env` and fill in the values

```bash
IAM_PROFILE=default
SERVICE_NAME=send-email-with-ses
MY_REGION=us-east-1
EMAIL_DOMAIN=yourdomain.com
```

* IAM_PROFILE - The name of the IAM profile you want to use in your credentials profile
* SERVICE_NAME - The name of the this service that you will see in AWS
* MY_REGION - The region you want to deploy to within AWS
* EMAIL_DOMAIN - The domain you want to use for your emails to send from.

### Installing and Deploying

```bash
yarn install
serverless deploy --verbose
```

### Testing the email

Open up Lambda, and find the function called send-email-ses-dev, and click on it.

Hint it will be something like this: https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/send-email-ses-dev?tab=code (unless you have changed the region and/or service name)

Click on the Test tab, and create a new test event. 

```json
{
  "name": "Name of User",
  "email": "yourverifiedemail@example.com",
  "subject": "This is a test email! I hope you like it! 🥳"
}
```

### Invoking the email from another Lambda function


