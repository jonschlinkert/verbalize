'use strict';

var Emitter = require('component-emitter');
var utils = require('../lib/utils');

module.exports = function(options) {
  return function(app) {
    if (typeof this['logger'] !== 'undefined') return;
    var logger = new EventLogger();

    logger.on('create', function(name) {
      logger.on(name, function(mode, msg) {
        if (mode == null || isEnabled(app, mode)) {
          console.log(mode, msg);
          return;
        }
      });

      app.define(name, {
        get: function() {
          return logger[name];
        }
      });
    });

    logger.on('mode', function(mode) {
      app.define(mode, {
        get: function() {
          return logger[mode];
        }
      });
    });

    logger.on('operator', function(operator) {
      app.define(operator, {
        get: function() {
          return logger[operator];
        }
      });
    });

    logger.on('default', function() {
      console.log.apply(console, arguments);
    });

    // this.define('logger', logger);
    this.define('log', function() {
      var args = ['default'].concat([].slice.call(arguments));
      return logger.log.apply(logger, args);
    });

    this.log.__proto__ = logger;
  };
};

/**
 * Create a new `EventLogger`
 *
 * @api public
 */

function EventLogger() {
  this.previousMode = null;
  this.mode = null;
  this.state = null;
}

/**
 * Mixin `Emitter` prototype methods
 */

Emitter(EventLogger.prototype);

EventLogger.prototype.define = function(key, value) {
  utils.define(this, key, value);
  return this;
};

EventLogger.prototype.mixin = function(key, getter, setter) {
  var options = {
    configurable: true,
    enumerable: true,
    get: getter
  };

  if (typeof setter === 'function') {
    options.set = setter;
  }

  utils.define(EventLogger.prototype, key, options);
};

/**
 * Factory for creating logger emitters.
 *
 * @param  {String} `name` the name of the log event to emit. Example: `info`
 * @param  {String} `message` Message intended to be logged to the console.
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.log = function(msg) {
  var event = this.state.stack && this.state.stack.length ? this.state.stack.join('.') : name;
  this.emit.apply(this, [event, this.state.mode].concat(this.state.args));

  this.previousMode = this.mode;
  this.mode = null;
  this.state = null;
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
  var getter = buildLogger.call(this, name);
  var setter = function(fn) {
    fn.__proto__ = EventLogger.prototype;
    utils.define(EventLogger.prototype, name, {
      configurable: true,
      enumerable: true,
      value: fn
    });
  };

  this.mixin(name, getter, setter);
  this.emit('create', name);
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
  modes.forEach(function(mode) {
    this.mixin(mode, buildMode.call(this, mode));
    this.emit('mode', mode);
  }.bind(this));
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
    this.mixin(operator, getter);
    this.emit('operator', operator);
  }.bind(this));
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
    this.state = this.state || {};
    this.state.stack = this.state.stack || [];
    this.state.stack.push(name);
    var logger = function(/*message*/) {
      this.state.args = [].slice.call(arguments);
      this.state.mode = this.mode;
      return this.log.apply(this);
    }.bind(this);

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

function isEnabled(app, prop) {
  if (!app.options) return false;
  var negate = false;
  if (/^not/.test(prop)) {
    negate = true;
    prop = prop.substr(3);
  }
  if (!app.options.hasOwnProperty(prop)) return false;
  return negate ? !app.options[prop] : app.options[prop];
}

/**
 * Expose `EventLogger`
 */

// module.exports = EventLogger;
