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

  this.options = options || {};
  this._sep    = this.options.sep;
  this._mode   = this.options.mode;
  this.verbose = {};

  // Expose verbose logging.
  // _.difference(this.keys(), this._omissions).filter(function(key) {
  //   return typeof this[key] === 'function';
  // }.bind(this)).forEach(function(key) {
  //   this.verbose[key] = function() {
  //     if(this._mode === 'verbose') {
  //       return this[key].apply(this, arguments);
  //     } else {
  //       return;
  //     }
  //   }.bind(this);
  // }.bind(this));
}

/**
 * Immutable colors array.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.colors = [
  'bgBlue',
  'bgGreen',
  'bgMagenta',
  'bgRed',
  'bgYellow',
  'blue',
  'green',
  'magenta',
  'red',
  'yellow'
];

/**
 * Handle logging modes.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.mode = function (mode) {
  this._mode = mode || 'normal';
};

function write() {
  var args = _.flatten([].slice.call(arguments));
  var foo = util.format.apply(util, args);
  console.log(foo)
  // process.stdout.write(foo);
}

write('foo');

/**
 * Write to the console.
 *
 * @return {String}
 */

Verbalize.prototype._write = function () {
  var args = _.flatten([].slice.call(arguments));
  console.log(args)
  process.stdout.write(util.format.apply(util, args));
};

/**
 * Write to the console followed by a newline. A blank
 * line is returned if no value is passed.
 *
 * @return {String}
 */

Verbalize.prototype._writeln = function (msg) {
  this._write((msg || '') + '\n');
};

/**
 * Base formatting.
 *
 * @return {String}
 */

Verbalize.prototype._format = function (args) {
  args = _.toArray(args);
  if (args.length > 0) {
    args[0] = args[0].toString();
  }
  return util.format.apply(util, args);
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
 * Write output followed by a newline.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.writeln = function () {
  this._writeln(this._format(arguments));
  return this;
};

/**
 * Base formatting for special logging.
 *
 * @return {String}
 */

Verbalize.prototype._formatStyle = function (color) {
  var args = [].slice.call(arguments);
  args[1] = chalk[color](args[1]);
  args.shift();

  return this._write(args.map(function (arg) {
    // if (this.option('stripColor')) {
    //   return chalk.stripColor(arg);
    // }
    return arg;
  }.bind(this)));
};

/**
 * Style a basic separator.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.sep = function (str) {
  return !this._sep
    ? this.gray(str || ' · ')
    : this._sep;
};

/**
 * **bold** white message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.log = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('bold', args);
};

/**
 * **bold** white message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.subhead = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('bold', args);
};

/**
 * Get the current time using `.toLocaleTimeString()`.
 *
 * @return {String}
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
  return this._formatStyle('gray', args);
};

/**
 * Display a **cyan** informational message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.info = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('cyan', args);
};

/**
 * Display a **yellow** warning message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.warn = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('yellow', args);
};

/**
 * Display a **red** error message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.error = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('red', args);
};

/**
 * Display a **green** success message.
 *
 * @return {String}
 * @api public
 */

Verbalize.prototype.success = function () {
  var args = [].slice.call(arguments);
  return this._formatStyle('green', args);
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
