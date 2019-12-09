const { subCommand } = require('../util');

module.exports = subCommand(
  ({ command }) => command.text.trim() === 'help',
  async ({ command, respond }) => {
    respond({
      response_type: 'ephemeral',
      text: `:wave: The \`/todo\` command is still a work-in-progress.`,
    });
  },
);
