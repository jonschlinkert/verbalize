'use strict';

var Verbalize = require('../');
var utils = require('../lib/utils');

module.exports = function(options) {
  var opts = utils.extend({defaultListener: true}, options);

  return function(app) {
    if (typeof this['logger'] !== 'undefined') return;
    var logger = new Verbalize();
    logger.options = app.options;
    logger.on('addLogger', addMethod);
    logger.on('addMode', addMethod);

    addMethods(logger.modifiers);
    addMethods(logger.modes);

    // defaults
    logger.addMode('verbose');
    logger.addMode('not', {type: 'toggle'});

    if (opts.defaultListener === true) {
      logger.on('*', function(name, stats) {
        this.handle(stats);
      });
    }

    this.define('logger', {
      enumerable: true,
      configurable: true,
      get: function() {
        function fn() {
          var args = [].slice.call(arguments);
          args.unshift('log');
          return logger._emit.apply(logger, args);
        }
        fn.__proto__ = logger;
        return fn;
      }
    });

    function addMethod(name) {
      app.define(name, {
        enumerable: true,
        configurable: true,
        get: function() {
          return logger[name];
        }
      });
    }

    function addMethods(obj) {
      var methods = Object.keys(obj);
      var len = methods.length, i = -1;
      while(++i < len) {
        addMethod(methods[i]);
      }
    }
  };
};
