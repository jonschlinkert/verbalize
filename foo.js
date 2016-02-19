// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  }
});

var utils = require('./lib/utils');
if (argv.hasOwnProperty('verbose') && utils.isFalsey(argv.verbose)) {
  argv.verbose = false;
}

var Verbalize = require('./');
var colors = require('./plugins/colors');
var styles = require('./plugins/styles');
var isEnabled = require('./plugins/is-enabled');

var logger = new Verbalize(utils.extend({}, argv));
logger.use(colors());
logger.use(styles());
logger.use(isEnabled());

logger.define('process', function(stats) {
  var modes = stats.modes.map(function(mode) {
    return mode.name;
  });

  if (this.isEnabled(modes)) {
    var res = stats.modifiers.reduce(function(acc, modifier) {
      acc = this.stylize(modifier, acc);
      return acc;
    }.bind(this), stats.args);
    this.writeln.apply(this, res);
  }
});

// logger modes
logger.mode('verbose');
logger.mode('not', {type: 'negative'});

logger.on('*', function(stats) {
  this.process(stats);
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
