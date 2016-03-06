'use strict';

var utils = require('../utils');

/**
 *
 */

module.exports = function(options) {
  return function(app) {
    this.define('handle', function(stats) {
      if (!stats.name) return;
      var modes = stats.getModes('name');
      if (this.isEnabled(modes)) {
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
        var res = app.emitters[stats.name].fn.apply(app, args);
        if (typeof res === 'string') {
          args[0] = res;
        }

        // write the modified arguments to process.stdout.
        this.writeln.apply(this, args);
      }
    });
  };
};
