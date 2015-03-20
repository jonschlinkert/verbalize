/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var util = require('util');
var chalk = require('chalk');
var _ = require('lodash');
var Config = require('./config');

/**
 * Create a new instance of Verbalize.
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
  this.color = {};

  // Expose chalk
  Object.keys(chalk.styles).map(function(color) {
    this[color] = function () {
      return chalk[color].apply(chalk, arguments);
    }.bind(this);
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
 * [Strip color](https://github.com/sindresorhus/strip-ansi) from a string.
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
 * Getter/setter for defining a Verbalize `runner`. This is useful
 * if you want the runner to display in the console or in templates.
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
 * Write to the console.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._write = function () {
  var args = _.flatten([].slice.call(arguments));
  process.stdout.write(util.format.apply(util, args));
};

/**
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
 * Base formatting.
 *
 * @return {String}
 * @api private
 */

Verbalize.prototype._format = function (args) {
  args = _.toArray(args);
  if (args.length > 0) {
    args[0] = args[0].toString();
  }
  return util.format.apply(util, args);
};

/**
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
 * Why? Because I think we all deserve to have more
 * egregiously annoying colors in the console.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.rainbow = function () {
  var args = [].slice.call(arguments);
  var colors = ['red', 'yellow', 'green', 'blue', 'magenta', 'bgRed', 'bgYellow', 'bgGreen', 'bgBlue', 'bgMagenta'];
  var len = colors.length;

  function tasteTheRainbow(str) {
    return str.split('').map(function(ea, i) {
      if (ea === ' ') {
        return ea;
      } else {
        return chalk[colors[i++ % len]](ea);
      }
    }).join('');
  }

  args[0] = tasteTheRainbow.call(this, args[0]);
  this._write(this._format(args));
  return this;
};

/**
 * Write output.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.wrap = function () {
  this._write(this._format(arguments));
  return this;
};

/**
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
 * Style a basic separator
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.sep = function (str) {
  return this._sep ? this._sep : this.gray(str || ' · ');
};

/**
 * **bold** white message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.log = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('bold', args);
};

/**
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
 * Display a **red** error message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.error = function () {
  var args = [].slice.call(arguments);
  return this._formatStyles('red', args);
};

/**
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
