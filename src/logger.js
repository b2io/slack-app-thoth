const pino = require('pino');

module.exports = pino({ enabled: process.env.NODE_ENV !== 'test' });
