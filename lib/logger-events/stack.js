'use strict';

var utils = require('./utils');

/**
 * Stack contructor that manages logger stats
 * being built up through method chaining.
 */

function Stack() {
  if (!(this instanceof Stack)) {
    return new Stack();
  }

  utils.define(this, 'items', []);
  utils.define(this, 'current', null);
  this.createStats();
}

Stack.prototype.createStats = function(parent) {
  var modifiers = utils.arrayify(parent && parent.modifiers);
  var stats = new Stats({modifiers: modifiers});
  this.current = stats;
  this.items.push(stats);
  return this;
};

Stack.prototype.addModifier = function(mod) {
  if (this.current.name) {
    this.createStats();
  }
  this.current.addModifier(mod);
  return this;
};

Stack.prototype.addLogger = function(logger) {
  if (this.current.name) {
    this.createStats(this.current);
  }
  this.current.name = logger;
  this.current.addLogger(logger);
  return this;
};

Stack.prototype.setName = function(name) {
  if (!utils.isLast(this.current.loggers, name)) {
    this.current.addLogger(name);
  }
  this.current.name = name;
  return this;
};

Stack.prototype.process = function(fn, thisArg) {
  var items = this.items;
  this.items = [];
  items.forEach(fn, thisArg);
  return this;
};

function Stats(config) {
  if (!(this instanceof Stats)) {
    return new Stats(config);
  }
  config = utils.extend({}, config);
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      this[key] = config[key];
    }
  }
}

Stats.prototype.addModifier = function(mod) {
  this.modifiers = (this.modifiers || []).concat(utils.arrayify(mod));
  return this;
};

Stats.prototype.addLogger = function(logger) {
  this.loggers = (this.loggers || []).concat(utils.arrayify(logger));
};

/**
 * Exposes `Stack`
 */

module.exports = Stack;
