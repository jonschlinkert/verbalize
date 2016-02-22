'use strict';

var Verbalize = require('../');
var utils = require('../lib/utils');

module.exports = function(options) {
  return function(app) {
    if (typeof this['logger'] !== 'undefined') return;
    var logger = new Verbalize();
    logger.options = app.options;

    function addMethod(name) {
      app.define(name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this.logger[name];
        }
      });
    }

    logger.on('addLogger', addMethod);
    logger.on('addMode', addMethod);

    this.define('logger', function() {
      return logger.log.apply(logger, args);
    });

    this.logger.__proto__ = logger;
  };
};
