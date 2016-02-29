// 'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  },
  boolean: ['verbose']
});

var Base = require('base');
var option = require('base-option');

var logger = require('base-logger');
var utils = require('../lib/utils');

function App(options) {
  if (!(this instanceof App)) {
    return new App(options);
  }
  this.options = utils.extend({verbose: false}, this.options, options);
  Base.call(this);
  this.use(option());

  // use verbose logger plugin
  this.use(logger());
}

Base.extend(App);

var app = new App(argv);

console.log('---------- USING .logger ----------');
console.log();

app.logger
  .verbose.info('verbose msg')
  .not.verbose.info('not.verbose msg')
  .writeln();

app.logger
  .verbose.subhead('--- VERBOSE INFO---').not.verbose.subhead('--- IMPORTANT INFO ---')
  .verbose.inform('inform msg')
  .verbose.info('info msg')
  .verbose.warn('warn msg')
  .verbose.error('error msg').not.verbose.error('error msg')
  .verbose.success('success msg').not.verbose.success('success msg')
  .writeln();

console.log('-------------------------------');
console.log();

console.log('---------- USING app ----------');
console.log();

app
  .verbose.info('verbose msg')
  .not.verbose.info('not verbose msg')
  .writeln();

app
  .verbose.subhead('--- VERBOSE INFO---').not.verbose('--- IMPORTANT INFO ---')
  .verbose.inform('inform msg')
  .verbose.info('info msg')
  .verbose.warn('warn msg')
  .verbose.error('error msg').not.verbose.error('error msg')
  .verbose.success('success msg').not.verbose.success('success msg')
  .writeln();

// app.warn.verbose('warn.verbose msg')
//    .info.not.verbose('info.not.verbose msg');

console.log('-------------------------------');
console.log();
