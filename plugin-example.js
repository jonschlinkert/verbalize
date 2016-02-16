// 'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    v: 'verbose'
  }
});

var Base = require('base');
var option = require('base-option');

var verbose = require('./plugins/base-logger');
var styles = require('./plugins/styles');
var utils = require('./lib/utils');

function App(options) {
  if (!(this instanceof App)) {
    return new App(options);
  }
  this.options = utils.extend({verbose: false}, this.options, options);
  Base.call(this);
  this.use(option());

  // use verbose logger plugin
  this.use(verbose());

  // use styles plugin on the logger
  this.log.use(styles());
}

Base.extend(App);

var app = new App(argv);

app.log.method('verbose', function(context) {
  context.write = this.options.verbose === true;
});

app.log.method('notverbose', function(context) {
  context.write = this.options.verbose === false;
});

console.log('---------- USING log ----------');
console.log();

app.log
  .verbose.info('verbose')
  .notverbose.info('notverbose')
  .writeln();

app.log
  .verbose.subhead('--- VERBOSE INFO---').notverbose('--- IMPORTANT INFO ---')
  .verbose.inform('inform')
  .verbose.info('info')
  .verbose.warn('warn')
  .verbose.error('error').notverbose.error('error')
  .verbose.success('success').notverbose.success('success')
  .writeln();

console.log('-------------------------------');
console.log();

console.log('---------- USING app ----------');
console.log();


app
  .verbose.info('verbose')
  .notverbose.info('notverbose')
  .writeln();

app
  .verbose.subhead('--- VERBOSE INFO---').notverbose('--- IMPORTANT INFO ---')
  .verbose.inform('inform')
  .verbose.info('info')
  .verbose.warn('warn')
  .verbose.error('error').notverbose.error('error')
  .verbose.success('success').notverbose.success('success')
  .writeln();

console.log('-------------------------------');
console.log();
