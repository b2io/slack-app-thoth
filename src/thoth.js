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
  if (command.text.startsWith('add ')) {
    // TODO: [DM] Attempt to create a TODO based on the command text.
    // TODO: [DM] How should Thoth respond if success/failure cases?
  } else {
    respond({
      blocks: [
        {
          text: {
            text: `:wave: Need some help with \`/todo\`?`,
            type: 'mrkdwn',
          },
          type: 'section',
        },
        // TODO: [DM] Add explanation of `/todo add` into `/todo` help text.
      ],
      response_type: 'ephemeral',
    });
  }
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
