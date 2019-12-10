const { subCommand } = require('../../commands/util');
const logger = require('../../logger');
const Todo = require('../../models/todo');

const STATUS_MATCH = /\s*%([^\s]+)\s*/;
const TAG_MATCH = /\s*\+([^\s]+)\s*/;

const identity = v => v;

const findMatch = (str, regex, modify = identity) =>
  modify((str.match(regex) || [])[1]);

const omitMatch = (str, ...regexes) =>
  regexes.reduce((acc, curr) => acc.replace(curr, ' '), str).trim();

const smartAdd = text => {
  const description = omitMatch(text, TAG_MATCH, STATUS_MATCH);
  const status = findMatch(text, STATUS_MATCH, v =>
    ['done', 'in-progress', 'todo'].includes(v) ? v : 'todo',
  );
  const tag = findMatch(text, TAG_MATCH);

  return { description, status, tag };
};

module.exports = subCommand(
  ({ command }) => command.text.startsWith('add '),
  async ({ ack, command, respond }) => {
    ack();

    try {
      const input = command.text.replace(/^add /, '');
      const todo = smartAdd(input);

      await Todo.create({ ...todo, createdBy: command.user_id });

      respond({
        response_type: 'ephemeral',
        text: `:heavy_check_mark: Created TODO`,
      });
    } catch (error) {
      logger.error(`[/todo add]`, {
        error,
        text: command.text,
        userId: command.user_id,
      });

      respond({
        response_type: 'ephemeral',
        text: `:rotating_light: ${error.message}`,
      });
    }
  },
);
