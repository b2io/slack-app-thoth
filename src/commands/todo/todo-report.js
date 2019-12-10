const { action, subCommand } = require('../../commands/util');
const logger = require('../../logger');
const Todo = require('../../models/todo');

const compareString = (a = '', b = '') => a.localeCompare(b);

const compareAny = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const statusOrder = status => ['in-progress', 'todo', 'done'].indexOf(status);

const statusIndicator = status =>
  status === 'todo' ? '[ ]' : status === 'in-progress' ? '[-]' : '[x]';

const generateReport = todos =>
  [...todos]
    .sort((a, b) => {
      const tagResult = compareString(a.tag, b.tag);
      if (tagResult !== 0) return tagResult;

      const statusResult = compareAny(
        statusOrder(a.status),
        statusOrder(b.status),
      );
      if (statusResult !== 0) return statusResult;

      return compareAny(a.createdAt, b.createdAt);
    })
    .map(t =>
      ['-', statusIndicator(t.status), t.tag ? `${t.tag} -` : '', t.description]
        .filter(Boolean)
        .join(' '),
    )
    .join('\n');

module.exports = subCommand(
  ({ command }) => command.text.trim() === 'report',
  async ({ ack, command, respond }) => {
    ack();

    try {
      const userTodos = await Todo.all(command.user_id);

      if (userTodos.length === 0) {
        respond({
          response_type: 'ephemeral',
          text: `You don't currently have any TODOs`,
        });
      } else {
        const reportText = generateReport(userTodos);

        respond({
          blocks: [
            {
              accessory: {
                action_id: 'todo-report-publish',
                text: { text: 'Post', type: 'plain_text' },
                type: 'button',
                value: reportText,
              },
              text: { text: reportText, type: 'mrkdwn' },
              type: 'section',
            },
          ],
          response_type: 'ephemeral',
        });
      }
    } catch (error) {
      logger.error(`[/todo report]`, { error, userId: command.user_id });

      respond({
        response_type: 'ephemeral',
        text: `:rotating_light: ${error.message}`,
      });
    }
  },
  action('todo-report-publish', async ({ ack, action, respond }) => {
    ack();

    respond({
      delete_original: true,
      response_type: 'in_channel',
      text: action.value,
    });
  }),
);
