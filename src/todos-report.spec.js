const todosReport = require('./todos-report');

test('sorts by tag, status, and createdAt', () => {
  const actual = todosReport([
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

  expect(actual).toEqual(
    `
- [ ] Pick up the milk
- [x] Take out the trash
- [-] Project1 - Work on CCPA updates
- [-] Project1 - Work on GDPR updates
- [ ] Project1 - Stand-up meeting
    `.trim(),
  );
});
