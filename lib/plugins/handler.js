'use strict';

/**
 *
 */

module.exports = function(options) {
  return function(app) {
    this.define('handle', function(stats) {
      var modes = stats.modes.map(function(mode) {
        return mode.name;
      });

      if (this.isEnabled(modes)) {
        var res = stats.modes.reduce(function(acc, mode) {
          return mode.fn(acc);
        }, stats.args);
        res = stats.modifiers.reduce(function(acc, modifier) {
          return this.stylize(modifier, acc);
        }.bind(this), res);
        this.writeln.apply(this, res);
      }
    });
  };
};
