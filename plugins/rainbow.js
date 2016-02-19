'use strict';

/**
 * Why? Because we all deserve to have more
 * color in the console.
 *
 * @return {String}
 * @api public
 */

module.exports = function(options) {
  return function(app) {
    app.style('rainbow', function() {
      var args = [].slice.call(arguments);
      var colors = [
        'red',
        'yellow',
        'green',
        'blue',
        'cyan',
        'magenta',
        'bold',
        'white'
      ];

      var len = colors.length;

      function tasteTheRainbow(str) {
        return str.split('').map(function(ele, i) {
          if (ele === ' ') {
            return ele;
          } else {
            return app.stylize(colors[i++ % len], ele);
          }
        }).join('');
      }

      args[0] = tasteTheRainbow.call(this, args[0]);
      return args;
    });
  };
};
