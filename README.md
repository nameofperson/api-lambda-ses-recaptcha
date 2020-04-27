
# AWS Serverless Mailer with ReCaptcha
### Api Gateway -> Lambda (Send Email) -> SES (Simple Email Service)

## Description

This is fork from the excellent work of Alexander Simovic in simalexan/api-lambda-send-email-ses, for creating a serverless component that sends emails through SES by implenting an API Gateway and a Lambda function. 

Here I've merely extended it to include ReCaptcha, as a common use case for this solution involves a front-end form (such as a contact form in a business page) and a mailer just to notify the webmaster that a request has been received.

## Solution description

- an Api Gateway with a POST `/mailerSend` endpoint, that requires two parameters:
  - `subject`, a string representing the subject of the email

  - `message`, a string representing the message of the email, can be either HTML or regular text

- a Lambda that sends an email to one or more specified email addresses. Also, depending if the `message` is in a Text or HTML format, it will send it in either of those formats. 

### Optional Payload Params
  - `toEmails`, Array of strings, that represent all the emails you want to send an email to (only when `UseSelfEmail` is 'No', please see **Deployment Parameters** below)

  - `ccEmails` and `replyToEmails`, both of Array of strings type.

## Deployment Parameters

This component has four CloudFormation deployment parameters:

- `FromEmail`, a required parameter, represents the email sender. Must be a SES verified email. If you attempt to send email using a non-verified address or domain, the operation results in an "Email address not verified" error.

- `RecaptchaSecret`, a required parameter, represents the ReCaptcha secret which will be used to validate the token sent from the request. If you call the API and the reCaptcha is invalid the email will not be sent.

- `UseSelfEmail`, a required parameter, to specify if mailer should use `FromEmail` as both sender and target (typically to self-mail a response from the Web). Default value is **'Yes'**

- `CorsOrigin`, an optional parameter, where you can restrict access to only specified domains.

## Build Instructions

If you use SAM locally along with Docker Desktop, and want to test out the API, define first a JSON file with the correct values:

```json
{
  "LambdaEmailer": {
    "FROM_EMAIL": "myEmail@email.com.test",
    "RECAPTCHA_SECRET": "AAAAAbbbbbCCCCCCddddddeeeee11111",
    "CORS_ORIGIN": "http://myWebsite.is.great",
    "USE_SELF_EMAIL": "Yes"
  }
}
```

then just use the following command:

```
sam local start-api --env-vars <yourJSONFileName> -d <port> --region <yourRegionName>
```

Additionally, if you use VS Code and want to debug the Javacript Code, add a `launch.json` file in your _.vscode_ folder such as this one:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to SAM CLI",
            "type": "node",
            "request": "attach",
            "address": "localhost",
            "port": 5858,
            "localRoot": "${workspaceRoot}",
            "remoteRoot": "/var/task",
            "protocol": "inspector",
            "stopOnEntry": false
        }
    ]
}

```
and that will allow you to attach the Debugger and trigger breakpoints.


If you make any private changes, you can always this template to your personal AWS account library, via the following commands:

```
sam package --template-file template.yml --output-template-file dist/packaged-sam.yml --s3-bucket <yourTemplateBucketName> --profile <yourProfileName>
```

```
sam publish --template dist/packaged-sam.yml --region <regionName> --profile <yourProfileName>
```

## Latest Release 
- v0.1.0
  - Recaptcha logic working
  - SAM scripting updated
  - `UseSelfEmail` flag

## Roadmap - Upcoming changes

Here are the upcoming changes that I'll add to this serverless component:

- Security Checks
