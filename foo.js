// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  }
});

var falseWords = ['none', 'nil', 'nope', 'no', 'not', 'nada', '0', 'false'];
var falsey = require('falsey');

if (argv.hasOwnProperty('verbose') && falsey(argv.verbose, falseWords)) {
  argv.verbose = false;
}

var utils = require('./lib/utils');
var Verbalize = require('./');
var colors = require('./plugins/colors');
var styles = require('./plugins/styles');

var logger = new Verbalize(utils.extend({}, argv));
logger.use(colors());
logger.use(styles());
logger.define('isEnabled', function(modes) {
  if (!modes) return true;
  var comparison = true;
  var mode = modes.split('.').filter(function(m) {
    if (falsey(m, falseWords)) {
      comparison = !comparison;
      return false;
    }
    return true;
  })[0];

  if (!mode) return comparison;
  return this.options[mode] === comparison;
});

logger.define('process', function(stats) {
  if (this.isEnabled(stats.mode)) {
    var res = stats.style.reduce(function(acc, style) {
      acc = this.stylize(style, acc);
      return acc;
    }.bind(this), stats.args);
    this.writeln.apply(this, res);
  }
});

// logger modes
logger.modes(['verbose', 'not']);

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
