# How it works

This will create a SES service with a domain and a subdomain. It will also create a IAM role for the lambda function to use.

* SES
* Lambda

## Important notes:

* Make sure you own YOUR_DOMAIN.com and it's registered in route53 (This is required)
* This script will register `YOUR_DOMAIN.com` in SES and also setup DKIM signing, so you can send email from `anyname@YOUR_DOMAIN.com`
* If you are deploying to a new domain, and are in Sandbox mode, you will need to verify the email address you are sending to. This can be done in the AWS console. 
* If you are out of Sandbox mode, you do not need to verify the email address you are sending to.

### Open Up serverless.yml 

Edit the Custom part to match your setup

```yml
custom:
  IAM_PROFILE: default
  SERVICE_NAME: YOUR_NAME-ses
  MY_REGION: us-east-1
  DOMAIN: YOUR_DOMAIN.com
```

### Installing and Deploying

```bash
yarn install
serverless deploy --verbose
```

Please note - 

### Invoking the email send function from AWS console

Open up Lambda, and find the function called YOUR_NAME-ses-dev-sendEmail, and click on it.

Click on the Test tab, and create a new test event. 

```json
{
  "name": "Name of User",
  "email": "yourverifiedemail@example.com",
	"subject" : "This is a test email"
}
```
