'use strict';

var util = require('util');
var define = require('define-property');
var Emitter = require('component-emitter');
var chalk = require('chalk');
var use = require('use');

function Logger(options) {
  this.options = options || {};
  this.init();
  use(this);
}

Emitter(Logger.prototype);

function mixinChalk(app) {
  if (app.red) return;
  var keys = Object.keys(chalk.styles);
  keys = keys.concat(Object.keys(chalk));
  var len = keys.length;
  while (len--) {
    var key = keys[len];
    app[key] = chalk[key];
  }
}

Logger.prototype.init = function() {
  mixinChalk(this);
  this.messages = [];
  this.methods = {};
  this.styles = {};
  this.modes = {};

  this.create('success', '0', this.green);
  this.create('debug', '0');
  this.create('info', '1', this.cyan);
  this.create('warn', '2', this.yellow);
  this.create('error', '3', this.red);
  this.create('fail', '4');

  this.style('fail', function() {
    return this.underline(this.red.apply(this, arguments));
  });
};

Logger.prototype._emit = function(name, level, args) {
  var msg = { name: name, level: level, args: args };
  this.messages.push(msg);
  this.emit(name, msg);
  this.emit('*', msg);
};

Logger.prototype.mode = function(name) {
  var msg = { name: name, level: level, args: args };
  this.messages.push(msg);
  this.emit(name, msg);
  this.emit('*', msg);
};

Logger.prototype.write = function(msg) {
  if (!this.silent) {
    console.log(msg);
  }
};

Logger.prototype.style = function(name, fn) {
  this.styles[name] = fn.bind(this);
  return this;
};

Logger.prototype.stylize = function(text, name) {
  var method = this.methods[name];
  var fn = this.styles[method.style] || this.styles[name] || method.style;
  if (typeof fn === 'function') {
    text = fn(text);
  }
  return text;
};

Logger.prototype.create = function(name, level, style) {
  this.methods[name] = { level: level, style: style };
  Logger.prototype[name] = function() {
    var args = [].slice.call(arguments);
    this._emit(name, level, args)
    args[0] = this.stylize(args[0], name);
    this.write.apply(this, args);
  }.bind(this);
};

/**
 * Define non-enumerable property `key` with the given value.
 *
 * @param {String} `key`
 * @param {any} `value`
 * @return {String}
 * @api public
 */

Logger.prototype.define = function(key, value) {
  define(this, key, value);
  return this;
};

// Logger.prototype.debug = function(msg) {
//   this.write('debug', msg);
// };

// Logger.prototype.log = function(msg) {
//   this.write('log', msg);
// };

// Logger.prototype.info = function(msg) {
//   this.write('info', msg);
// };

// Logger.prototype.warn = function(msg) {
//   this.write('warn', msg);
// };

// Logger.prototype.error = function(msg) {
//   this.write('error', msg);
// };

// Logger.prototype.success = function(msg) {
//   this.write('success', msg);
// };

module.exports = Logger;

var logger = new Logger();

logger.on('*', function(type, level, msg) {
  console.log(arguments);
});

logger.on('fail', function(msg) {
  console.log(msg);
});

logger.warn('foo');
logger.fail('bar');
console.log(logger)
