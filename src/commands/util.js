const noop = () => {};

const command = (name, subCommands, defaultSubCommand = noop) => {
  const handler = async ({ ack, ...api }) => {
    ack();

    const subCommand =
      subCommands.find(sc => sc.predicate(api)) || defaultSubCommand;

    subCommand(api);
  };

  handler.register = app => {
    app.command(name, handler);
    subCommands.forEach(subCommand => {
      subCommand.actions.forEach(action => {
        app.action(action.constraints, action);
      });
    });
  };

  return handler;
};

const subCommand = (predicate, handler, ...actions) => {
  handler.actions = actions;
  handler.predicate = predicate;

  return handler;
};

const action = (constraints, handler) => {
  handler.constraints = constraints;

  return handler;
};

module.exports = { action, command, subCommand };
