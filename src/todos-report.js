const compareString = (a = '', b = '') => a.localeCompare(b);

const compareAny = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

const statusOrder = status => ['in-progress', 'todo', 'done'].indexOf(status);

const statusIndicator = status =>
  status === 'todo' ? '[ ]' : status === 'in-progress' ? '[-]' : '[x]';

const todosReport = todos =>
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

module.exports = todosReport;
