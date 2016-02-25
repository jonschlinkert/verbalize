// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose',
    d: 'debug'
  },
  boolean: ['strict'],
  default: {
    strict: false
  }
});

var utils = require('../lib/utils');
if (argv.hasOwnProperty('verbose') && utils.isFalsey(argv.verbose)) {
  argv.verbose = false;
}
if (argv.hasOwnProperty('debug') && utils.isFalsey(argv.debug)) {
  argv.debug = false;
}

var Verbalize = require('../');
var rainbow = require('../lib/plugins/rainbow');

var logger = new Verbalize(utils.extend({}, argv));
logger.use(rainbow());

/**
 * Logger modes
 */

// just an option setting
logger.addMode('verbose');

// use this as a toggle value
logger.addMode('not', {type: 'toggle'});
logger.addMode('or', {type: 'toggle'});

// option setting but allows modifying the content
logger.addMode('debug', function(msg) {
  return '[debug]: ' + msg;
});

logger.on('*', function(name, stats) {
  // console.log(stats);
  // if (stats.hasMode('debug')) {
  //   debug('base:' + stats.name).apply(null, stats.args);
  //   return;
  // }

  this.handle(stats);
});

logger
  .info('this is a normal info message') // always logged
  .verbose.info('this is a verbose message') // logged when `options.verbose === true`
  .not.verbose.info('this is a not.verbose message') // logged when `options.verbose === false`
  .not.not.verbose.info('this is a not.not.verbose message') // logged when `options.verbose === true`
  .not.verbose.not.info('this is a not.verbose.not message') // logged when `options.verbose === true`
  .writeln();

logger
  .verbose.error('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.inform('inform')
  .verbose.info('info')
  .verbose.warn('warn')
  .verbose.error('error').not.verbose.error('error')
  .verbose.success('success').not.verbose.success('success')
  .writeln();

logger
  .verbose.red.subhead('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.yellow.inform.info.warn.error.success('some verbose information')
  .not.verbose.error.success('some not verbose information')
  .writeln();

logger.green('use a style directly');
logger.debug.yellow('this is a debug option');

logger.verbose('this is directly in verbose')
  .not.verbose('this is directly in not verbose')
  .debug('this is directly in debug')
  .not.debug('this is directly in not debug');


logger.rainbow('this is a rainbow!!!!');
