const Todo = require('../models/todo');
const todoCommand = require('./todo');

const stubCall = ({
  text = '',
  trigger_id = 'TRIGGER#0',
  user_id = 'USER#0',
} = {}) => {
  const ack = jest.fn();
  const respond = jest.fn();
  const say = jest.fn();

  return {
    ack,
    command: { text, user_id },
    payload: { trigger_id },
    respond,
    say,
  };
};

jest.mock('../models/todo', () => {
  return {
    all: jest.fn(() => Promise.resolve([])),
    create: jest.fn(() => Promise.resolve('TODO#0')),
  };
});

test('should acknowledge invocations', async () => {
  const call = stubCall();

  await todoCommand(call);

  expect(call.ack).toHaveBeenCalled();
});

describe('/todo add', () => {
  test('should respond to the user', async () => {
    const call = stubCall({
      text: 'add Stand-up meeting +ProjectName',
    });

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      response_type: 'ephemeral',
      text: `:heavy_check_mark: Created TODO`,
    });
  });

  test('should create a TODO using smart-add syntax', async () => {
    const call = stubCall({
      text: 'add Emergency bugfix +ProjectName %in-progress',
      user_id: 'USER#1',
    });

    await todoCommand(call);

    expect(Todo.create).toHaveBeenCalledWith({
      createdBy: 'USER#1',
      description: 'Emergency bugfix',
      status: 'in-progress',
      tag: 'ProjectName',
    });
  });

  test('should handle errors creating the TODO', async () => {
    const call = stubCall({ text: 'add FAIL' });
    Todo.create.mockRejectedValueOnce(new Error('Unable to create TODO'));

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      response_type: 'ephemeral',
      text: ':rotating_light: Unable to create TODO',
    });
  });
});

describe('/todo report', () => {
  test('should tell the user they have no TODOs', async () => {
    const call = stubCall({ text: 'report' });
    Todo.all.mockResolvedValueOnce([]);

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      response_type: 'ephemeral',
      text: `You don't currently have any TODOs`,
    });
  });

  test('should report TODO status to the user', async () => {
    const call = stubCall({ text: 'report' });
    Todo.all.mockResolvedValueOnce([
      {
        createdAt: 0,
        description: 'Pick up the milk',
        status: 'todo',
        tag: undefined,
      },
      {
        createdAt: 2,
        description: 'Take out the trash',
        status: 'done',
        tag: undefined,
      },
      {
        createdAt: 1,
        description: 'Stand-up meeting',
        status: 'todo',
        tag: 'Project1',
      },
      {
        createdAt: 4,
        description: 'Work on GDPR updates',
        status: 'in-progress',
        tag: 'Project1',
      },
      {
        createdAt: 3,
        description: 'Work on CCPA updates',
        status: 'in-progress',
        tag: 'Project1',
      },
    ]);
    const expectedText = `
- [ ] Pick up the milk
- [x] Take out the trash
- [-] Project1 - Work on CCPA updates
- [-] Project1 - Work on GDPR updates
- [ ] Project1 - Stand-up meeting
                  `.trim();

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      blocks: [
        {
          accessory: {
            action_id: 'todo-report-publish',
            text: { text: 'Post', type: 'plain_text' },
            type: 'button',
            value: expectedText,
          },
          text: { text: expectedText, type: 'mrkdwn' },
          type: 'section',
        },
      ],
      response_type: 'ephemeral',
    });
  });
});

describe('/todo help', () => {
  test('should respond to the user', async () => {
    const call = stubCall({ text: 'help' });

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      response_type: 'ephemeral',
      text: ':wave: The `/todo` command is still a work-in-progress.',
    });
  });

  test('should be the fallback sub-command', async () => {
    const call = stubCall({ text: 'not-a-subcommand' });

    await todoCommand(call);

    expect(call.respond).toHaveBeenCalledWith({
      response_type: 'ephemeral',
      text: ':wave: The `/todo` command is still a work-in-progress.',
    });
  });
});
