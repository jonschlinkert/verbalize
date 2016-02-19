'use strict';

var Emitter = require('component-emitter');
var utils = require('./utils');
var Mode = require('./mode');
var Modifier = require('./modifier');
var Stack = require('./stack');

function create() {

  /**
   * Create a new `Logger` constructor to allow
   * updating the prototype without affecting other contructors.
   *
   * @api public
   */

  function Logger() {
    if (!(this instanceof Logger)) {
      return new Logger();
    }

    this.methods = {};
    this.modes = {};
    this.modifiers = {};
    this.stack = new Stack();
  }

  /**
   * Mixin `Emitter` prototype methods
   */

  Emitter(Logger.prototype);

  /**
   * Factory for creating emitting log messages.
   *
   * @param  {String} `name` the name of the log event to emit. Example: `info`
   * @param  {String} `message` Message intended to be emitted.
   * @return {Object} `Logger` for chaining
   * @api public
   */

  Logger.prototype._emit = function(name/*, message*/) {
    var args = [].slice.call(arguments, 1);
    var logger = this.modifiers[name];
    if (!logger) {
      throw new Error('Unable to find logger "' + name + '"');
    }
    this.stack.setName(logger);
    // console.log(this.stack.items);
    this.stack.process(function(stats) {
      stats.args = args;
      this.emit.call(this, '*', stats);
      this.emit.call(this, stats.name, stats);
    }, this);
    return this;
  };

  /**
   * Create a logger method to emit an event with the given `name`.
   *
   * @param  {String} `name` the name of the log event to emit
   * @return {Object} `Logger` for chaining
   * @api public
   */

  Logger.prototype.create = function(name, options) {
    this.methods[name] = null;
    Object.defineProperty(Logger.prototype, name, {
      configurable: true,
      enumerable: true,
      get: buildLogger.call(this, name, options),
      set: function(fn) {
        this.methods[name] = fn;
        return fn;
      }
    });
    return this;
  };

  /**
   * Add arbitrary modes to be used for creating namespaces for logger methods.
   *
   * @param  {String} `mode` Mode to add to the logger.
   * @param  {Object} `options` Options to describe the mode.
   * @return {Object} `Logger` for chaining
   * @api public
   */

  Logger.prototype.mode = function(mode, options) {
    Object.defineProperty(Logger.prototype, mode, {
      configurable: true,
      enumerable: true,
      get: buildMode.call(this, mode, options)
    });
    return this;
  };

  /**
   * Create a logger getter function that can be used in chaining
   *
   * @param  {String} `name` the name of the log event to emit
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildLogger(name, options) {
    var opts = utils.extend({name: name, type: 'logger'}, options);
    var logger = new Modifier(opts);
    this.modifiers[name] = logger;

    return function() {
      if (utils.hasType(logger.type, 'logger')) {
        this.stack.addLogger(logger);
      } else {
        this.stack.addModifier(logger);
      }
      var method;
      if (typeof this.methods[name] === 'function') {
        method = this.methods[name];
      } else {
        method = function(/*message*/) {
          var args = [].slice.call(arguments);
          args.unshift(name);
          return this._emit.apply(this, args);
        }.bind(this);
        this.methods[name] = method;
      }
      method.__proto__ = Logger.prototype;
      return method;
    }.bind(this);
  }

  /**
   * Create an instance of a mode object that switches
   * the current `mode` of the logger.
   *
   * @param  {String} `mode` mode to set when getting this proeprty.
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildMode(name, options) {
    var opts = utils.extend({name: name, type: 'mode'}, options);
    var mode = new Mode(opts);
    this.modes[name] = mode;

    /* jshint validthis: true */
    var self = this;
    var getter = function() {
      self.stack.addMode(mode);
      var ModeWrapper = function() {};
      var inst = new ModeWrapper();
      inst.__proto__ = Logger.prototype;
      return inst;
    };
    return getter;
  }

  return Logger;
}

/**
 * Expose `logger-events`
 */

module.exports = create();

/**
 * Allow users to create a new Constructor
 */

module.exports.create = create;
