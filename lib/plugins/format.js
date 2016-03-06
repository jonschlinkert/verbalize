'use strict';

var utils = require('../utils');

/**
 *
 */

module.exports = function(options) {
  return function(app) {
    this.define('format', function(stats) {
      var modes = stats.getModes('name');
      if (!this.isEnabled(modes)) {
        return;
      }

      var level = typeof this.options.loglevel === 'undefined'
        ? 100
        : this.options.loglevel;

      // iterate over the modes and apply any of their modifier
      // functions to the arguments.
      var args = stats.modes.reduce(function(acc, mode) {
        return mode.fn(acc);
      }, stats.args);

      // iterate over the styles and apply any of their
      // modifier functions to the arguments
      args = stats.styles.reduce(function(acc, style) {
        return this.styles[style](acc);
      }.bind(this), args);

      args = utils.toArray(args);
      var emitter = app.emitters[stats.name];
      if (emitter) {
        var res = emitter.fn.apply(app, args);
        if (typeof res === 'string') {
          args[0] = res;
        }
      }

      if (emitter && emitter.level <= level) {
        // write the modified arguments to process.stdout.
        this.writeln.apply(this, args);
      }
    });
  };
};
