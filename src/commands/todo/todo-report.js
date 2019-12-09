const { subCommand } = require('../../commands/util');
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
  async ({ command, respond }) => {
    try {
      const userTodos = await Todo.all(command.user_id);

      if (userTodos.length === 0) {
        respond({
          response_type: 'ephemeral',
          text: `You don't currently have any TODOs`,
        });
      } else {
        respond({
          response_type: 'ephemeral',
          // TODO: [DM] Improve response text from Thoth.
          // TODO: [DM] Add action to send in the channel if that's possible.
          text: generateReport(userTodos),
        });
      }
    } catch (error) {
      respond({
        response_type: 'ephemeral',
        text: `:rotating_light: ${error}`,
      });
    }
  },
);
