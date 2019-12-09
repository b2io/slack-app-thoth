const command = subCommands => async ({ ack, ...api }) => {
  ack();

  const subCommand = subCommands.find(sc => sc.predicate(api));

  if (subCommand) {
    subCommand.execute(api);
  }
};

const subCommand = (predicate, execute) => ({ execute, predicate });

module.exports = { command, subCommand };
