/*!
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
var Config = require('./config');


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

  Config.call(this);

  this.options = options || {};
  this._sep    = this.options.sep;
  this._runner = this.options.runner;
  this._mode   = this.options.mode;
  this.verbose = {};
  this.cache = {};

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

util.inherits(Verbalize, Config);


/**
 * ## .stripColor
 *
 * [Strip color](https://github.com/sindresorhus/strip-ansi) from a string.
 *
 * **Example usage**:
 *
 * ```js
 * // using getter/setters
 * logger.stripColor = false;
 * logger.stripColor = true;
 *
 * // or enable/disable
 * logger.enable('stripColor');
 * logger.disable('stripColor');
 * ```
 *
 * @api public
 */

Object.defineProperty(Verbalize.prototype, 'stripColor', {
  set: function (value) {
    Verbalize.prototype.set('stripColor', value);
  }.bind(Verbalize.prototype),
  get: function () {
    return Verbalize.prototype.get('stripColor');
  }.bind(Verbalize.prototype)
});


/**
 * ## .runner
 *
 * Getter/setter for defining a Verbalize `runner`. This is useful
 * if you want the runner to display in the console or in templates.
 *
 * **Example usage**:
 *
 * ```js
 * logger.runner = {
 *   name: 'your-lib',
 *   url: https://github.com/abc/your-lib
 * };
 *
 * console.log(logger.runner)
 * //=> { name: 'your-lib', url: https://github.com/abc/your-lib };
 * ```
 *
 * @api public
 */

Object.defineProperty(Verbalize.prototype, 'runner', {
  set: function (value) {
    Verbalize.prototype.set('runner', value);
  }.bind(Verbalize.prototype),
  get: function () {
    return Verbalize.prototype.get('runner');
  }.bind(Verbalize.prototype)
});


/**
 * ## .mode
 *
 * Handle logging modes.
 *
 * @method `mode`
 * @return {String}
 * @api public
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
 * @api public.
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
 * ## ._write
 *
 * Write to the console.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._write = function () {
  var args = _.flatten([].slice.call(arguments));
  return process.stdout.write.apply(process.stdout, args);
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
 * ## ._format
 *
 * Base formatting.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._format = function (args) {
  args = _.toArray(args);
  if (args.length > 0) {
    args[0] = String(args[0]);
  }
  return util.format.apply(util, args);
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

Verbalize.prototype._formatStyles = function (color) {
  var args = [].slice.call(arguments);
  args[1] = this[color](args[1]);
  args.shift();

  return this._write(args.map(function (arg) {
    if (this.enabled('stripColor')) {
      return chalk.stripColor(arg);
    }
    return arg;
  }.bind(this)));
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
 * @return {String}
 * @api public
 */

Verbalize.prototype.sep = function (str) {
  return this._sep ? this._sep : this.gray(str || ' · ');
};


/**
 * ## .log
 *
 * **bold** white message.
 *
 * @return {String}
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
 * ## .subhead
 *
 * **bold** white message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.subhead = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('bold', args);
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
 * Display a **gray** timestamp.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.timestamp = function () {
  var args = [].slice.call(arguments);
  args[0] = this.time() + this.gray(args[0]);
  return console.log.apply(this, args);
};


/**
 * ## .inform
 *
 * Display a **gray** informational message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.inform = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('gray', args);
};


/**
 * ## .info
 *
 * Display a **cyan** informational message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.info = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('cyan', args);
};


/**
 * ## .warn
 *
 * Display a **yellow** warning message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.warn = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('yellow', args);
};


/**
 * ## .error
 *
 * Display a **red** error message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.error = function () {
  var args = _.toArray(arguments)
  return this._formatStyles('red', args);
};


/**
 * ## .success
 *
 * Display a **green** success message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.success = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('green', args);
};


/**
 * ## .fatal
 *
 * Display a **red** error message and exit with `process.exit(1)`

 * @return {String}
 * @api public
 */

Verbalize.prototype.fatal = function () {
  var args = [].slice.call(arguments);
  args[0] = (this.red('  ' + this.runner + ' [FAIL]:') + this.gray(' · ') + args[0]);
  console.log();
  console.log.apply(this, args);
  process.exit(1);
};


module.exports = Verbalize;