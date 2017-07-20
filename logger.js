'use strict';

var logger = require('winston');

logger.level = 'debug';
logger.add(logger.transports.File, {filename: './log.log'});

module.exports = logger;
