'use strict';

module.exports = function(options) {
  return function() {
    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('log', 5, function() {
      return this.white(...arguments);
    });

    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('subhead', function() {
      return this.bold(...arguments);
    });

    /**
     * Get the current time using `.toLocaleTimeString()`.
     *
     * @return {String}
     */

    this.style('time', function() {
      var time = new Date().toLocaleTimeString();
      return this.bgBlack(this.white(time)) + ' ';
    });

    /**
     * Display a **gray** timestamp.
     *
     * @return {String}
     * @api public
     */

    this.style('timestamp', function() {
      return this.time() +
        this.gray(...arguments);
    });

    /**
     * Display a **gray** informational message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('inform', 4, function() {
      return this.gray(...arguments);
    });

    /**
     * Display a **cyan** informational message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('info', 4, function() {
      // return this.stylize('cyan', arguments);
      return this.cyan(...arguments);
    });

    /**
     * Display a **yellow** warning message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('warn', 3, function() {
      return this.yellow(...arguments);
    });

    /**
     * Display a **red** error message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('error', 1, function() {
      return this.red(...arguments);
    });

    /**
     * Display a **green** success message.
     *
     * @return {String}
     * @api public
     */

    this.emitter('success', 2, function() {
      return this.green(...arguments);
    });

    /**
     * Display a **red** error message and exit with `process.exit(1)`

     * @return {String}
     * @api public
     */

    this.emitter('fail', 0, function() {
      var args = [].slice.call(arguments);
      args[0] = (this.red('  ' + this.runner + ' [FAIL]:') + this.gray(' · ') + args[0]);
      console.log();
      console.log.apply(this, args);
      process.exit(1);
    });
  };
};
