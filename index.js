/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('./lib/utils');
var Emitter = require('component-emitter');
var define = require('define-property');
var chalk = require('chalk');
var util = require('util');
var use = require('use');

/**
 * Create an instance of `Verbalize` with the given `options`.
 *
 * ```js
 * var logger = new Verbalize({verbose: true});
 * ```
 * @param {Object} `options`
 * @api public
 */

function Verbalize(options) {
  if (!(this instanceof Verbalize)) {
    return new Verbalize(options);
  }
  define(this, 'cache', {});
  this.options = options || {};
  this.verbose = {};
  use(this);
}

/**
 * Mixin emitter
 */

Emitter(Verbalize.prototype);

/**
 * Base formatting.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._format = function(args) {
  if (typeof args === 'string') {
    args = [args];
  } if (!Array.isArray(args) && args.length) {
    args = [].slice.call(args);
  } else {
    args = [].concat.apply([].slice.call(arguments));
  }
  if (args.length > 0) {
    args[0] = String(args[0]);
  }
  return util.format.apply(util, args);
};

/**
 * Stylize the given `msg` with the specified `color`.
 *
 * @param {String} `color` The name of the color to use
 * @param {String} `msg` The args to stylize.
 * @return {String}
 */

Verbalize.prototype.stylize = function(color, args) {
  args = utils.arrayify(args);
  var len = args.length;
  var args = [];
  var idx = 0;

  var strip = this.options.stripColor === true;
  while (++idx < len) {
    var arg = arguments[idx];
    if (strip) {
      args.push(chalk.stripColor(arg));
    } else {
      args.push(arg);
    }
  }
  return this._write.apply(this, args);
};

/**
 * Write to the console.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._write = function(msg) {
  process.stdout.write(utils.markup(msg || ''));
  return this;
};

/**
 * Write to the console followed by a newline. A blank
 * line is returned if no value is passed.
 *
 * @return {String} `msg`
 * @api public
 */

Verbalize.prototype._writeln = function(msg) {
  this._write((msg || '') + '\n');
  return this;
};

/**
 * Write output.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.write = function() {
  this._write(this._format(arguments));
  return this;
};

/**
 * Write output followed by a newline.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.writeln = function() {
  this._writeln(this._format(arguments));
  return this;
};

/**
 * Style a basic separator.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.sep = function(str) {
  return this._sep || (this._sep = this.gray(str || ' · '));
};

/**
 * Log a message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.log = function() {
  var args = [].slice.call(arguments);
  return this.stylize('white', args);
};

/**
 * Define non-enumerable property `key` with the given value.
 *
 * @param {String} `key`
 * @param {any} `value`
 * @return {String}
 * @api public
 */

Verbalize.prototype.define = function(key, value) {
  define(this, key, value);
  return this;
};

/**
 * Expose `Verbalize`
 */

module.exports = Verbalize;
