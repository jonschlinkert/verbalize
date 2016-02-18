'use strict';

var Emitter = require('component-emitter');
var utils = require('./utils');

/**
 * Create a new `EventLogger`
 *
 * @api public
 */

function EventLogger() {
  if (!(this instanceof EventLogger)) {
    return new EventLogger();
  }

  this.methods = {};
  this.stack = [];
}

/**
 * Mixin `Emitter` prototype methods
 */

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
  var args = [].slice.call(arguments, 1);
  if (this.stack.length === 0) {
    this.stack.push(createStats(name));
  } else {
    args.unshift(name);
  }

  var len = this.stack.length, i = -1;
  while (++i < len) {
    var stats = this.stack[i];
    stats.args = args;
    this.emit.call(this, stats.name, stats);
  }
  this.stack = [];
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
  this.methods[name] = null;
  Object.defineProperty(EventLogger.prototype, name, {
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
 * Add arbitrary modes to be used for creating namespaces for logger methods.
 *
 * @param  {Array|String} `modes` Mode or array of modes to add to the logger.
 * @return {Object} `EventLogger` for chaining
 * @api public
 */

EventLogger.prototype.modes = function(modes) {
  modes = utils.arrayify(modes);
  modes.forEach(function(mode) {
    Object.defineProperty(EventLogger.prototype, mode, {
      configurable: true,
      enumerable: true,
      get: buildMode.call(this, mode)
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
    var stats = getOrCreateStats(this.stack);
    stats.style.push(name);
    stats.name = name;

    var logger;
    if (typeof this.methods[name] === 'function') {
      logger = this.methods[name];
    } else {
      logger = function(/*message*/) {
        var args = [].slice.call(arguments);
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
    var stats = getOrCreateStats(self.stack);
    stats.mode = stats.mode ? (stats.mode + '.' + mode) : mode;

    var Mode = function() {};
    var inst = new Mode();
    inst.__proto__ = EventLogger.prototype;
    return inst;
  };
  return getter;
}

  // {
  //   mode: 'verbose',
  //   style: ['underline', 'not.error'],
  //   name: 'error',
  //   args: ['some message'],
  //   level: 1,
  //   template: '<%= foo %>'
  // }

function createStats(logger) {
  var stats = {
    mode: '',
    style: [],
    name: logger || ''
  };
  return stats;
}

function getOrCreateStats(stack) {
  var stats = {};
  if (stack.length) {
    stats = stack[stack.length - 1];
  } else {
    stats = createStats();
    stack.push(stats);
  }
  return stats;
}

/**
 * Expose `EventLogger`
 */

module.exports = EventLogger;




  // fn.__proto__ = this;
  // this.define(name, {
  //   enumerable: true,
  //   configurable: true,
  //   get: function() {
  //     this.stack.push({
  //       type: type,
  //       name: name,
  //       fn: utils.get(this.cache, [type, name])
  //     });
  //     return fn;
  //   }
  // });
  // this.emit('addMethod', name);
  //
  //

// Verbalize.prototype.invoke = function(args) {
//   this.invoking = true;
//   var context = {
//     stack: this.stack,
//     args: args,
//     write: true
//   };

//   var len = this.stack.length, i = -1;
//   var res = args[0];

//   while(++i < len) {
//     var ctx = this.stack[i];
//     switch(ctx.type) {
//       case 'styles':
//         res = ctx.fn.call(this, res);
//         break;

//       case 'methods':
//       default: {
//         ctx.fn.call(this, context);
//       }
//     }
//     if (context.write === false) break;
//   }
//   if (context.write) {
//     this.writeln.apply(this, [res]);
//   }
//   this.stack = [];
//   this.invoking = false;
//   return this;
// };

