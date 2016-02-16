/*!
 * verbalize <https://github.com/jonschlinkert/verbalize>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Emitter = require('component-emitter');
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
  this.define('cache', {});
  this.define('stack', []);
  this.define('invoking', false);
  this.options = options || {};
  use(this);
}

/**
 * Mixin `Emitter` prototype methods
 */

Emitter(Verbalize.prototype);

Verbalize.prototype.method = function(name, fn) {
  utils.set(this.cache, ['methods', name], fn);
  this.addMethod(name, 'methods', function() {
    if (this.invoking) {
      return fn.apply(this, arguments);
    }
    return this.invoke(arguments);
  }.bind(this));
};

Verbalize.prototype.style = function(name, fn) {
  utils.set(this.cache, ['styles', name], fn);
  this.addMethod(name, 'styles', function() {
    if (this.invoking) {
      return fn.apply(this, arguments);
    }
    return this.invoke(arguments);
  }.bind(this));
};

Verbalize.prototype.addMethod = function(name, type, fn) {
  fn.__proto__ = this;
  this.define(name, {
    enumerable: true,
    configurable: true,
    get: function() {
      this.stack.push({
        type: type,
        name: name,
        fn: utils.get(this.cache, [type, name])
      });
      return fn;
    }
  });
  this.emit('addMethod', name);
};

Verbalize.prototype.invoke = function(args) {
  this.invoking = true;
  var context = {
    stack: this.stack,
    args: args,
    write: true
  };

  var len = this.stack.length, i = -1;
  var res = args[0];

  while(++i < len) {
    var ctx = this.stack[i];
    switch(ctx.type) {
      case 'styles':
        res = ctx.fn.call(this, res);
        break;

      case 'methods':
      default: {
        ctx.fn.call(this, context);
      }
    }
    if (context.write === false) break;
  }
  if (context.write) {
    this.writeln.apply(this, [res]);
  }
  this.stack = [];
  this.invoking = false;
  return this;
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
