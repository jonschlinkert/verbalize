/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var EventLogger = require('./lib/event-logger');
var utils = require('./lib/utils');
var util = require('util');
var use = require('use');

/**
 * Expose `Verbalize`
 */

module.exports = Verbalize;

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
  // EventLogger.call(this);
  this.define('cache', {});
  this.options = options || {};
  this.verbose = {};
  use(this);
}

/**
 * Inherit EventLogger
 */

util.inherits(Verbalize, EventLogger);

/**
 * Base formatting.
 *
 * @return {String} `msg`
 * @api public
 */
function toArray(args) {
  if (typeof args === 'string') {
    args = [args];
  } if (!Array.isArray(args) && args.length) {
    args = [].slice.call(args);
  } else {
    args = [].concat.apply([].slice.call(arguments));
  }
  return args;
}

Verbalize.prototype._format = function(args) {
  args = toArray.apply(null, arguments);

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
  args = toArray(args);
  var len = args.length;
  var res = [];
  var idx = -1;

  var strip = this.options.stripColor === true;
  while (++idx < len) {
    var arg = args[idx];
    if (strip) {
      res.push(utils.stripColor(arg));
    } else {
      res.push(arg);
    }
  }
  return this.write.apply(this, res);
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
  return this._write((msg || '') + '\n');
};

/**
 * Write output.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.write = function() {
  return this._write(this._format(arguments));
};

/**
 * Write output followed by a newline.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.writeln = function() {
  return this._writeln(this._format(arguments));
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
  return this.stylize('white', arguments);
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
  utils.define(this, key, value);
  return this;
};
