// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  }
});

var Verbalize = require('./');
var styles = require('./plugins/styles');
var utils = require('./lib/utils');

var logger = new Verbalize();
logger.use(styles());

logger.options = utils.extend({verbose: false}, argv);

logger.method('verbose', function(context) {
  context.write = this.options.verbose === true;
});

logger.method('notverbose', function(context) {
  context.write = this.options.verbose === false;
});

logger
  .verbose.info('verbose')
  .notverbose.info('notverbose')
  .writeln();

logger
  .verbose.subhead('--- VERBOSE INFO---').notverbose('--- IMPORTANT INFO ---')
  .verbose.inform('inform')
  .verbose.info('info')
  .verbose.warn('warn')
  .verbose.error('error').notverbose.error('error')
  .verbose.success('success').notverbose.success('success')
  .writeln();
