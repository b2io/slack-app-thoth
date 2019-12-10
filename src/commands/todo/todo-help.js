const { subCommand } = require('../util');

module.exports = subCommand(
  ({ command }) => command.text.trim() === 'help',
  async ({ ack, command, respond }) => {
    ack();

    respond({
      response_type: 'ephemeral',
      text: `:wave: The \`/todo\` command is still a work-in-progress.`,
    });
  },
);
