/**
 * verbalize <https://github.com/jonschlinkert/verbalize>
 * A lightweight logging library.
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var chalk = require('chalk');
var _ = require('lodash');
var _str = require('underscore.string');


var toArray = function(args) {
  return [].slice.call(args);
};


/**
 * ## Verbalize
 *
 * Create a new instance of Verbalize.
 *
 * **Example:**
 *
 * ```js
 * var logger = new Verbalize({verbose: true});
 * ```
 *
 * @class `Verbalize`
 * @param {Object} options
 * @constructor
 * @api public
 */

function Verbalize(options) {
  if (!(this instanceof Verbalize)) {
    return new Verbalize(options);
  }
  this.options = options || {};
  this._sep    = this.options.sep;
  this._runner = this.options.runner;
  this._mode   = this.options.mode;
  this.verbose = {};
  this.cache = {};

  // Get or set a Verbalize `runner`
  Object.defineProperty(this, 'runner', {
    set: function (value) {
      this.set('runner', value);
    }.bind(this),
    get: function () {
      return this.get('runner');
    }.bind(this)
  });

  // Expose chalk
  Object.keys(chalk.styles).map(function(color) {
    this[color] = function () {
      return chalk[color].apply(chalk, arguments);
    };
  }.bind(this));

  // Expose verbose logging.
  _.difference(this.keys(), this._omissions).filter(function(key) {
    return typeof this[key] === 'function';
  }.bind(this)).forEach(function(key) {
    this.verbose[key] = function() {
      if(this._mode === 'verbose') {
        return this[key].apply(this, arguments);
      } else {
        return;
      }
    }.bind(this);
  }.bind(this));
}


/**
 * ## .option
 *
 * Get or set an option.
 *
 * @param  {String} `key`
 * @param  {*} `value`
 * @return {*}
 */

Verbalize.prototype.option = function (key, value) {
  if (arguments.length === 1) {
    return this.get(key);
  }
  this.set(key, value);
};


/**
 * Define the current Verbalize `runner` so that it
 * shows as part of certain console messages.
 *
 * @param  {Object} `runner`
 * @return {Object}
 */

// Verbalize.prototype.runner = function (runner) {
//   return this._runner = runner ? {
//     name: runner.name,
//     url: runner.url
//   } : this._runner;
// };


/**
 * ## .set
 *
 * Assign `value` to `key`.
 *
 * **Example**
 *
 * ```js
 * logger.set('a', {b: 'c'});
 * ```
 *
 * @method `set`
 * @param {String} `key`
 * @param {*} `value`
 * @return {Verbalize} for chaining
 * @api public
 */

Verbalize.prototype.set = function set(key, value) {
  this.cache[key] = value;
  return this;
};


/**
 * ## .get
 *
 * Get the stored value of `key`.
 *
 * **Example**
 *
 * ```js
 * cache.get('foo');
 * ```
 *
 * @method get
 * @param {*} `key`
 * @return {*}
 * @api public
 */

Verbalize.prototype.get = function get(key) {
  return this.cache[key];
};


/**
 * ## .keys
 *
 * Return all of the keys on the `Verbalize` prototype.
 *
 * **Example**
 *
 * ```js
 * cache.keys();
 * ```
 *
 * @method `keys`
 * @param {*} `key`
 * @return {*}
 * @api public
 */

Verbalize.prototype.keys = function () {
  return _.methods(this);
};


/**
 * ## .mode
 *
 * Handle logging modes.
 *
 * @method `mode`
 * @return {String}
 * @api private
 */

Verbalize.prototype.mode = function (mode) {
  this._mode = mode || 'normal';
};


/**
 * ## .omit
 *
 * Pass an array of methods to omit from verbose logging.
 *
 * @param  {Array} `arr`
 * @return {Array}
 */

Verbalize.prototype.omit = function (arr) {
  this._omissions = _.union([], [
    '_format',
    '_runner',
    'fatal',
    'mode',
    'omit',
    'options',
    'runner',
    'sep',
    'verbose'
  ], arr);
};


/**
 * ## ._formatStyles
 *
 * Base formatting for special logging.
 *
 * @method `_formatStyles`
 * @return {String}
 * @api private
 */

Verbalize.prototype._formatStyles = function () {
  var args = _.flatten([].slice.call(arguments, function (arg) {
    return chalk.stripColor(arg);
  }));
  args[1] = chalk[args[0]](args[1]);
  args.shift();
  return process.stdout.write.apply(process.stdout, args);
};


/**
 * ## _.format
 *
 * Base formatting for special logging.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._format = function (args) {
  args = _.toArray(args);
  if (args.length > 0) {
    args[0] = String(args[0]);
  }
  if (this._runner) {
    return util.format.apply(util, args);
  }
  return util.format.apply(util, args);
};



/**
 * Done.
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype._addRunner = function () {
  var args = _.toArray(arguments);
  args[0] = chalk.green('  ' + this.runner.name + ' [' + args[0] + ']' + this._sep);
  return args;
};



/**
 * ## ._write
 *
 * Write to the console.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._write = function (msg) {
  process.stdout.write(msg || '');
};


/**
 * ## ._writeln
 *
 * Write to the console followed by a newline. A blank
 * line is returned if no value is passed.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._writeln = function (msg) {
  this._write((msg || '') + '\n');
};


/**
 * ## .write
 *
 * Write output.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.write = function () {
  this._write(this._format(arguments));
  return this;
};


/**
 * ## .writeln
 *
 * Write a output followed by a newline.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.writeln = function () {
  this._writeln(this._format(arguments));
  return this;
};


/**
 * ## .sep
 *
 * Style a basic separator
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.sep = function (str) {
  return this._sep ? this._sep : this.gray(str || ' · ');
};


/**
 * ## .log
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.log = function () {
  var args = [].slice.call(arguments, function (arg) {
    return chalk.stripColor(arg);
  });
  args[0] = chalk.bold(args[0]);
  return console.log.apply(this, args);
};


/**
 * ## .time
 *
 * Get the current time using `.toLocaleTimeString()`.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype.time = function () {
  var time = new Date().toLocaleTimeString();
  return chalk.bgBlack.white(time) + ' ';
};


/**
 * ## .timestamp
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.timestamp = function () {
  var args = [].slice.call(arguments);
  args[0] = this.time() + chalk.gray(args[0]);
  return console.log.apply(this, args);
};


/**
 * ## .inform
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.inform = function () {
  var args = _.toArray(arguments);
  return this._formatStyles('gray', args);
};


/**
 * ## .info
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.info = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('cyan', args);
};



/**
 * ## .warn
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.warn = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('yellow', args);
};


/**
 * ## .error
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.error = function () {
  var args = _.toArray(arguments)
  return this._formatStyles('red', args);
};


/**
 * ## .success
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.success = function () {
  var args = _.toArray(arguments);
  return this._formatStyles('green', args);
};


/**
 * ## .subhead
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.subhead = function () {
  var args = _.toArray(arguments);
  return this._formatStyles('bold', args);
};


/**
 * ## .fatal
 *
 * @return {string}
 * @api public
 */

Verbalize.prototype.fatal = function () {
  var args = _.toArray(arguments);
  args[0] = (chalk.red('  ' + this.runner + ' [FAIL]:') + chalk.gray(' · ') + args[0]);
  console.log();
  console.log.apply(this, args);
  process.exit(1);
};


module.exports = Verbalize;