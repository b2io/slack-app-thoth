const { App, ExpressReceiver, LogLevel } = require('@slack/bolt');
const { createServer, proxy } = require('aws-serverless-express');

const todoCommand = require('./commands/todo');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  logLevel: process.env.IS_OFFLINE ? LogLevel.DEBUG : LogLevel.WARN,
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

todoCommand.register(app);

app.error(error => {
  console.error(`[thoth]`, { error });
});

module.exports.handler = (event, context, callback) => {
  const server = createServer(receiver.app);

  context.succeed = response => {
    server.close();
    callback(null, response);
  };

  return proxy(server, event, context);
};
