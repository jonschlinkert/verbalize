/*
 * grunt-legacy-event-logger <http://gruntjs.com/grunt-legacy-event-logger>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var Emitter = require('component-emitter');

/**
 * Create an instance of `EventLogger`
 *
 * @api public
 */

function EventLogger() {
  this.methods = {};
  this.events = [];
  this.previousMode = null;
  this.mode = null;
}

// mixin `Emitter` methods
Emitter(EventLogger.prototype);

/**
 * Factory for creating logger emitters.
 *
 * @param  {String} `name` the name of the log event to emit. Example: `info`
 * @param  {String} `message` Message intended to be logged to the console.
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.log = function(name/*, message*/) {
  var event = this.events.length === 0 ? name : this.events.join('.');
  this.events = [];
  var args = [].slice.call(arguments, 1);
  this.emit.apply(this, [event].concat(args));
  this.previousMode = this.mode;
  this.mode = null;
  return this;
};

/**
 * Create a logger method to emit an event with the given `name`.
 *
 * @param  {String} `name` the name of the log event to emit
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.create = function(name) {
  var self = this;
  this.methods[name] = null;
  Object.defineProperty(EventLogger.prototype, name, {
    configurable: true,
    enumerable: true,
    get: buildLogger.call(this, name),
    set: function(fn) {
      self.methods[name] = fn;
      return fn;
    }
  });
  return this;
};

/**
 * Add arbitrary modes to be used for creating namespaces for logger methods.
 *
 * @param  {Array|String} `modes` Mode or array of modes to add to the logger.
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.modes = function(modes) {
  modes = Array.isArray(modes) ? modes : [modes];
  var self = this;
  modes.forEach(function(mode) {
    Object.defineProperty(EventLogger.prototype, mode, {
      configurable: true,
      enumerable: true,
      get: buildMode.call(self, mode)
    });
  });
  return this;
};

/**
 * Add an operator that will invoke the provided getter method.
 *
 * @param  {String} `ops` List of operations to add to the logger.
 * @param  {Function} `getter` Getter method to invoke when the operator property is accessed.
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.operator = function(operators, getter) {
  operators = Array.isArray(operators) ? operators : [operators];
  operators.forEach(function(operator) {
    Object.defineProperty(EventLogger.prototype, operator, {
      configurable: true,
      enumerable: true,
      get: getter
    });
  });
};

/**
 * Create a logger getter function that can be used in chaining
 *
 * @param  {String} `name` the name of the log event to emit
 * @return {Function} getter function to be used in `defineProperty`
 */

function buildLogger(name) {
  return function() {
    this.events.push(name);
    var logger;
    if (typeof this.methods[name] === 'function') {
      logger = this.methods[name];
    } else {
      logger = function(/*message*/) {
        var args = [].slice.call(arguments);
        args.unshift(this.mode);
        args.unshift(name);
        return this.log.apply(this, args);
      }.bind(this);
    }
    logger.__proto__ = EventLogger.prototype;
    return logger;
  }.bind(this);
}

/**
 * Create an instance of a mode object that switches
 * the current `mode` of the logger.
 *
 * @param  {String} `mode` mode to set when getting this proeprty.
 * @return {Function} getter function to be used in `defineProperty`
 */

function buildMode(mode) {
  /* jshint validthis: true */
  var self = this;
  var getter = function() {
    var Mode = function() {};
    var inst = new Mode();
    inst.__proto__ = EventLogger.prototype;
    self.mode = mode;
    return inst;
  };
  return getter;
}

/**
 * Expose `EventLogger`
 */

module.exports = EventLogger;
