'use strict';

var utils = require('../lib/utils');
var colors = require('./colors');

module.exports = function(options) {
  return function() {
    this.use(colors());

    /**
     * Log a message.
     *
     * @return {String}
     * @api public
     */

    this.style('log', function() {
      return this.stylize('white', arguments);
    });

    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.style('subhead', function() {
      return this.stylize('bold', arguments);
    });

    /**
     * Get the current time using `.toLocaleTimeString()`.
     *
     * @return {String}
     */

    this.style('time', function() {
      var time = new Date().toLocaleTimeString();
      return this.bgBlack.white(time) + ' ';
    });

    /**
     * Display a **gray** timestamp.
     *
     * @return {String}
     * @api public
     */

    this.style('timestamp', function() {
      var args = [].slice.call(arguments);
      args[0] = this.time() + this.gray(args[0]);
      return args;
    });

    /**
     * Display a **gray** informational message.
     *
     * @return {String}
     * @api public
     */

    this.style('inform', function() {
      return this.stylize('gray', arguments);
    });

    /**
     * Display a **cyan** informational message.
     *
     * @return {String}
     * @api public
     */

    this.style('info', function() {
      return this.stylize('cyan', arguments);
    });

    /**
     * Display a **yellow** warning message.
     *
     * @return {String}
     * @api public
     */

    this.style('warn', function() {
      return this.stylize('yellow', arguments);
    });

    /**
     * Display a **red** error message.
     *
     * @return {String}
     * @api public
     */

    this.style('error', function() {
      return this.stylize('red', arguments);
    });

    /**
     * Display a **green** success message.
     *
     * @return {String}
     * @api public
     */

    this.style('success', function() {
      return this.stylize('green', arguments);
    });

    /**
     * Display a **red** error message and exit with `process.exit(1)`

     * @return {String}
     * @api public
     */

    this.style('fatal', function() {
      var args = [].slice.call(arguments);
      args[0] = (this.red('  ' + this.runner + ' [FAIL]:') + this.gray(' · ') + args[0]);
      console.log();
      console.log.apply(this, args);
      process.exit(1);
    });
  };
};
