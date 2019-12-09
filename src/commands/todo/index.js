const { command } = require('../util');
const todoAdd = require('./todo-add');
const todoHelp = require('./todo-help');
const todoReport = require('./todo-report');

module.exports = command([todoAdd, todoReport, todoHelp]);
