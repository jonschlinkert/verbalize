'use strict';

var Emitter = require('component-emitter');
var utils = require('./utils');
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
    this.stack.setName(name);
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

  Logger.prototype.create = function(name) {
    this.methods[name] = null;
    Object.defineProperty(Logger.prototype, name, {
      configurable: true,
      enumerable: true,
      get: buildLogger.call(this, name),
      set: function(fn) {
        this.methods[name] = fn;
        return fn;
      }
    });
    return this;
  };

  /**
   * Add arbitrary modifiers to be used for creating namespaces for logger methods.
   *
   * @param  {Array|String} `modifiers` Modifier or array of modifiers to add to the logger.
   * @return {Object} `Logger` for chaining
   * @api public
   */

  Logger.prototype.modifiers = function(modifiers) {
    modifiers = utils.arrayify(modifiers);
    modifiers.forEach(function(modifier) {
      Object.defineProperty(Logger.prototype, modifier, {
        configurable: true,
        enumerable: true,
        get: buildModifier.call(this, modifier)
      });
    }, this);
    return this;
  };

  /**
   * Create a logger getter function that can be used in chaining
   *
   * @param  {String} `name` the name of the log event to emit
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildLogger(name) {
    return function() {
      this.stack.addLogger(name);
      var logger;
      if (typeof this.methods[name] === 'function') {
        logger = this.methods[name];
      } else {
        logger = function(/*message*/) {
          var args = [].slice.call(arguments);
          args.unshift(name);
          return this._emit.apply(this, args);
        }.bind(this);
      }
      logger.__proto__ = Logger.prototype;
      return logger;
    }.bind(this);
  }

  /**
   * Create an instance of a modifier object that switches
   * the current `modifier` of the logger.
   *
   * @param  {String} `modifier` modifier to set when getting this proeprty.
   * @return {Function} getter function to be used in `defineProperty`
   */

  function buildModifier(modifier) {
    /* jshint validthis: true */
    var self = this;
    var getter = function() {
      self.stack.addModifier(modifier);
      var Modifier = function() {};
      var inst = new Modifier();
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
