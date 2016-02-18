// colors
var red = require('ansi-red');
var cyan = require('ansi-cyan');
var yellow = require('ansi-yellow');
var green = require('ansi-green');

// event logger
var EventLogger = require('./lib/event-logger');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {v: 'verbose'}
});

/**
 * Example application
 */

function App(options) {
  this.options = options || {};
  this.log = new EventLogger(this.options);
}

App.prototype.option = function(key, value) {
  this.options[key] = value;
  return this;
};

App.prototype.isDisabled = function(mode) {
  return this.log.mode === mode
    && this.log.mode !== null
    && this.options[mode] !== true;
};

App.prototype.write = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  process.stdout.write(msg);
};

App.prototype.writeln = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  console.log(msg);
};

App.prototype.success = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  var args = [].slice.call(arguments, 2);
  console.log.apply(console, [green(msg)].concat(args));
};

App.prototype.info = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  var args = [].slice.call(arguments, 2);
  console.log.apply(console, [cyan(msg)].concat(args));
};

App.prototype.warn = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  var args = [].slice.call(arguments, 2);
  console.log.apply(console, [yellow(msg)].concat(args));
};

App.prototype.error = function(mode, msg) {
  if (this.isDisabled(mode)) return;
  var args = [].slice.call(arguments, 2);
  console.log.apply(console, [red(msg)].concat(args));
};


/**
 * Example usage
 */

var app = new App({verbose: false});

for (var key in argv) {
  app.option(key, argv[key]);
}

// logger modes
app.log.modes(['always', 'verbose', 'notverbose']);

var positives = ['yes'];
var negatives = ['no'];

function toggle() {
  positives.forEach(function(key) {
    app[key] = true
  })
}

app.log.operator('not', function() {
  this.toggle();
  return this;
});

// logger methods
app.log.create('info');
app.log.create('warn');
app.log.create('error');
app.log.create('success');
app.log.create('write');
app.log.create('writeln');

// setup listeners
Object.keys(app.log.methods).forEach(function(method) {
  app.log.on(method, app[method].bind(app));
});

// actual logging examples
// app.log.info('this is info').or.notverbose.info('not verbose');
app.log.success('this is success');
app.log.warn('this is warn');
app.log.error('this is error');
app.log.write('this is write\n');
app.log.writeln('this is writeln');

app.log.verbose.info('this is info');
app.log.verbose.warn('this is warn');
app.log.verbose.error('this is error');
app.log.verbose.write('this is write');
app.log.verbose.writeln('this is writeln');

app.options.verbose = true;
app.log.verbose.info('this is info').not.verbose.info('this is not verbose');

app.options.verbose = false;
app.options.notverbose = true;
app.log.verbose.info('this is info').not.verbose.info('this is not verbose');
