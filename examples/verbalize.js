// 'use strict';
var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  },
  boolean: ['verbose']
});

var Verbalize = require('../');
var utils = require('../lib/utils');

var logger = new Verbalize();
logger.options = utils.extend({verbose: false}, argv);

logger.on('*', function(name, stats) {
  this.format(stats);
});

logger
  .verbose.info('verbose msg')
  .not.verbose.info('not.verbose msg')
  .writeln();

logger
  .verbose.error('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.inform('inform msg')
  .verbose.info('info msg')
  .verbose.warn('warn msg')
  .verbose.error('error msg').not.verbose.error('error msg')
  .verbose.success('success msg').not.verbose.success('success msg')
  .writeln();
