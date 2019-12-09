# slack-app-thoth

## Setup

- Install global tools: `npm i -g ngrok serverless`
- Install project dependencies: `npm i`
- Setup DynamoDB locally: `serverless dynamodb install`
- Copy `.env.example` to `.env` and enter your `SLACK_BOT_TOKEN` and `SLACK_SIGNING_SECRET`

## Local Development

- Run locally: `serverless offline`
- Create an ngrok tunnel in another terminal: `ngrok http 3000`
- Update the "Request URL" on the slash command to `<ngrok-url>/slack/events`

## Deployment

- Deploy to AWS: `serverless deploy`
- Update the "Request URL" on the slash command to the `POST` endpoint
