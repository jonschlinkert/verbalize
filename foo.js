// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  },
  boolean: ['verbose']
});

var utils = require('./lib/utils');
var Verbalize = require('./');

var logger = new Verbalize(utils.extend({verbose: false}, argv));
logger.define('isEnabled', function(modes) {
  if (!modes) return true;
  var comparison = true;
  var mode = modes.split('.').filter(function(m) {
    if (m === 'not') {
      comparison = !comparison;
      return false;
    }
    return true;
  })[0];

  if (!mode) return comparison;
  return this.options[mode] === comparison;
});

// logger modes
logger.modes(['verbose', 'not']);

// logger methods
logger.create('info');
logger.create('warn');
logger.create('error');
logger.create('success');

logger.on('info', function(stats) {
  if (this.isEnabled(stats.mode)) {
    logger.writeln('%j', stats);
  }
});

logger
  .info('this is a normal info message')
  .verbose.info('this is a verbose message')
  .not.verbose.info('this is a not.verbose message')
  .not.not.verbose.info('this is a not.not.verbose message')
  .not.verbose.not.info('this is a not.verbose.not message')
  .writeln();

// logger
//   .verbose.error('--- VERBOSE INFO---').notverbose.subhead('--- IMPORTANT INFO ---')
//   .verbose.inform('inform')
//   .verbose.info('info')
//   .verbose.warn('warn')
//   .verbose.error('error').notverbose.error('error')
//   .verbose.success('success').notverbose.success('success')
//   .writeln();
