const { App, ExpressReceiver, LogLevel } = require('@slack/bolt');
const { createServer, proxy } = require('aws-serverless-express');

const smartAdd = require('./smart-add');
const todos = require('./todos');
const todosReport = require('./todos-report');

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  logLevel: process.env.IS_OFFLINE ? LogLevel.DEBUG : LogLevel.WARN,
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

app.command('/todo', async ({ ack, command, respond }) => {
  ack();
  if (command.text.startsWith('add ')) {
    try {
      const input = command.text.replace(/^add /, '');
      const todo = smartAdd(input);

      const id = await todos.create({ ...todo, createdBy: command.user_id });

      respond({
        response_type: 'ephemeral',
        text: `:heavy_check_mark: Created TODO "${input}"`,
      });
    } catch (error) {
      respond({
        response_type: 'ephemeral',
        text: `:rotating_light: ${error}`,
      });
    }
  } else if (command.text.trim() === 'report') {
    try {
      const userTodos = await todos.all(command.user_id);

      if (userTodos.length === 0) {
        respond({
          response_type: 'ephemeral',
          text: `You don't currently have any TODOs.`,
        });
      } else {
        respond({
          response_type: 'ephemeral',
          // TODO: [DM] Improve response text from Thoth.
          // TODO: [DM] Add action to send in the channel if that's possible.
          text: todosReport(userTodos),
        });
      }
    } catch (error) {
      respond({
        response_type: 'ephemeral',
        text: `:rotating_light: ${error}`,
      });
    }
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
        {
          text: {
            text: `Use \`/todo\` to keep track of your TODOs. Some examples include:`,
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          text: {
            text: `- \`/todo add Pick up the milk\``,
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          text: {
            text: `- \`/todo add Stand-up meeting +ProjectName\``,
            type: 'mrkdwn',
          },
          type: 'section',
        },
        {
          text: {
            text: `- \`/todo add Emergency bug fix +ProjectName %in-progress\``,
            type: 'mrkdwn',
          },
          type: 'section',
        },
        // TODO: [DM] Add help output for todo::report sub-command.
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
