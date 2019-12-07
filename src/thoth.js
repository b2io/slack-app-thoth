const { App, ExpressReceiver, LogLevel } = require('@slack/bolt');
const { createServer, proxy } = require('aws-serverless-express');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  logLevel: LogLevel.DEBUG,
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command('/todo', async ({ ack, command, respond }) => {
  ack();
  respond({
    blocks: [
      {
        text: { text: `\`/todo ${command.text}\``, type: 'mrkdwn' },
        type: 'section',
      },
    ],
    response_type: 'ephemeral',
  });
});

app.error(error => {
  console.error(error);
});

module.exports.handler = (event, context, callback) => {
  const server = createServer(receiver.app);

  context.succeed = response => {
    server.close();
    callback(null, response);
  };

  return proxy(server, event, context);
};
