'use strict';

var Verbalize = require('../../');
var utils = require('../utils');

module.exports = function(options) {
  var opts = utils.extend({defaultListener: true}, options);
  var Logger = Verbalize.create();

  return function(app) {
    if (typeof this['logger'] !== 'undefined') return;
    var logger = new Logger();
    logger.options = this.options;
    logger.on('addLogger', addMethod(this));
    logger.on('addMode', addMethod(this));

    addMethods(this, logger.modifiers);
    addMethods(this, logger.modes);

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

    function hasMethod(app, name) {
      if (app.hasOwnProperty(name)) {
        return true;
      }
      return false;
    }

    function addMethod(app, init) {
      return function(name) {
        if (hasMethod(app, name)) {
          if (init) return;
          throw new Error('App "' + app._name + '" already has a method "' + name + '". Unable to add logger method "' + name + '".');
        }
        app.define(name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return logger[name];
          }
        });
      };
    }

    function addMethods(app, obj) {
      var add = addMethod(app, true);
      var methods = Object.keys(obj);
      var len = methods.length, i = -1;
      while (++i < len) {
        add(methods[i]);
      }
    }
  };
};
