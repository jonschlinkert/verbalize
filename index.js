/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('log-events');
var util = require('util');
var use = require('use');
var utils = require('./lib/utils');
var plugins = require('./lib/plugins');

function create() {

  var Logger = Base.create();

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
    Logger.call(this);
    this.options = options || {};
    this.define('cache', {});
    use(this);
    this.initDefaults();
    this.initPlugins();
  }

  /**
   * Mixin `Logger` prototype methods
   */

  util.inherits(Verbalize, Logger);

  /**
   * Initialize default settings
   */

  Verbalize.prototype.initDefaults = function() {
    this.addMode('verbose');
    this.addMode('not', {mode: 'toggle'});
  };

  /**
   * Initialize core plugins
   */

  Verbalize.prototype.initPlugins = function() {
    this.use(plugins.colors(this.options));
    this.use(plugins.styles(this.options));
    this.use(plugins.isEnabled(this.options));
    this.use(plugins.handler(this.options));
  };

  /**
   * Base formatting.
   *
   * @return {String} `msg`
   * @api public
   */

  Verbalize.prototype._format = function(args) {
    args = utils.toArray.apply(null, arguments);

    if (args.length > 0) {
      args[0] = String(args[0]);
    }
    return util.format.apply(util, args);
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
   * Write formatted output.
   *
   * @return {String}
   * @api public
   */

  Verbalize.prototype.write = function() {
    return this._write(this._format(arguments));
  };

  /**
   * Write formatted output followed by a newline.
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
    return this._sep || (this._sep = this.stylize('gray', str || ' · '));
  };

  /**
   * Stylize the given `msg` with the specified `color`.
   *
   * @param {String} `color` The name of the color to use
   * @param {String} `msg` The args to stylize.
   * @return {String}
   * @api public
   */

  Verbalize.prototype.stylize = function(color, args) {
    args = utils.toArray(args);
    var len = args.length;
    var res = [];
    var idx = -1;

    var strip = this.options.stripColor === true;
    while (++idx < len) {
      var arg = args[idx];
      if (strip) {
        res.push(utils.stripColor(arg));
      } else {
        var modifier = null;
        if (typeof color === 'string') {
          modifier = utils.get(this.modifiers, [color]);
        } else {
          modifier = color;
        }
        if (modifier) {
          res.push(modifier.fn.call(this, arg));
        } else {
          res.push(arg);
        }
      }
    }
    return res;
  };

  /**
   * Add a style logger.
   *
   * ```js
   * logger.style('red', function() {
   *   return this.stylize('red', arguments);
   * });
   * ```
   * @param  {String} `name` Name of style logger method to be added to the logger.
   * @param  {Object} `options` Options to control style logger method.
   * @param  {Function} `fn` Optional function to do the styling.
   * @return {Object} `this` for chaining.
   * @api public
   */

  Verbalize.prototype.style = function(name, options, fn) {
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    var opts = utils.extend({type: ['modifier'], fn: fn}, options);
    return this.addLogger(name, opts);
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

  return Verbalize;
}

/**
 * Expose `Verbalize`
 */

module.exports = create();

/**
 * Static method to create a new constructor.
 * This is useful in tests and places where the original
 * prototype should not be updated.
 *
 * ```js
 * var MyLogger = Verbalize.create();
 * var logger = new MyLogger();
 * ```
 * @name Verbalize.create
 * @api public
 */

module.exports.create = create;
