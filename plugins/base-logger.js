'use strict';

var Verbalize = require('../');
var utils = require('../lib/utils');

module.exports = function(options) {
  return function(app) {
    if (typeof this['logger'] !== 'undefined') return;
    var logger = new Verbalize();
    logger.options = app.options;

    logger.on('addMethod', function(name) {
      app.define(name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.log[name];
        }
      });
    });

    this.define('log', function() {
      return logger.log.apply(logger, args);
    });

    this.log.__proto__ = logger;
  };
};