const smartAdd = require('./smart-add');

test.each([
  [
    'Stand-up meeting',
    {
      description: 'Stand-up meeting',
      status: 'todo',
      tag: undefined,
    },
  ],
  [
    'Review PRs #ProjectName',
    {
      description: 'Review PRs',
      status: 'todo',
      tag: 'ProjectName',
    },
  ],
  [
    '#ProjectName Review PRs',
    {
      description: 'Review PRs',
      status: 'todo',
      tag: 'ProjectName',
    },
  ],
  [
    'Review #ProjectName PRs',
    {
      description: 'Review PRs',
      status: 'todo',
      tag: 'ProjectName',
    },
  ],
  [
    'Finish estimates %in-progress',
    {
      description: 'Finish estimates',
      status: 'in-progress',
      tag: undefined,
    },
  ],
  [
    '%in-progress Finish estimates',
    {
      description: 'Finish estimates',
      status: 'in-progress',
      tag: undefined,
    },
  ],
  [
    'Finish %in-progress estimates',
    {
      description: 'Finish estimates',
      status: 'in-progress',
      tag: undefined,
    },
  ],
  [
    'Finish %invalid estimates',
    {
      description: 'Finish estimates',
      status: 'todo',
      tag: undefined,
    },
  ],
  [
    'Write blog article #ProjectName %in-progress',
    {
      description: 'Write blog article',
      status: 'in-progress',
      tag: 'ProjectName',
    },
  ],
  [
    '#ProjectName Write blog article %in-progress',
    {
      description: 'Write blog article',
      status: 'in-progress',
      tag: 'ProjectName',
    },
  ],
  [
    '#ProjectName %in-progress Write blog article ',
    {
      description: 'Write blog article',
      status: 'in-progress',
      tag: 'ProjectName',
    },
  ],
  [
    '#ProjectName Write %in-progress blog article ',
    {
      description: 'Write blog article',
      status: 'in-progress',
      tag: 'ProjectName',
    },
  ],
])('given %p, returns %p', (input, expected) => {
  expect(smartAdd(input)).toEqual(expected);
});
