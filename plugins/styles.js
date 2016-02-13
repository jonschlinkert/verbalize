'use strict';

module.exports = function(options) {
  return function() {

    /**
     * Style a **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.define('bold', function() {
      return this.stylize('bold', arguments);
    });

    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.define('subhead', function() {
      return this.stylize('bold', arguments);
    });

    /**
     * Get the current time using `.toLocaleTimeString()`.
     *
     * @return {String}
     */

    this.define('time', function() {
      var time = new Date().toLocaleTimeString();
      return chalk.bgBlack.white(time) + ' ';
    });

    /**
     * Display a **gray** timestamp.
     *
     * @return {String}
     * @api public
     */

    this.define('timestamp', function() {
      var args = [].slice.call(arguments);
      args[0] = this.time() + this.gray(args[0]);
      return console.log.apply(this, args);
    });

    /**
     * Display a **gray** informational message.
     *
     * @return {String}
     * @api public
     */

    this.define('inform', function() {
      return this.stylize('gray', arguments);
    });

    /**
     * Display a **cyan** informational message.
     *
     * @return {String}
     * @api public
     */

    this.define('info', function() {
      return this.stylize('cyan', arguments);
    });

    /**
     * Display a **yellow** warning message.
     *
     * @return {String}
     * @api public
     */

    this.define('warn', function() {
      return this.stylize('yellow', arguments);
    });

    /**
     * Display a **red** error message.
     *
     * @return {String}
     * @api public
     */

    this.define('error', function() {
      return this.stylize('red', arguments);
    });

    /**
     * Display a **green** success message.
     *
     * @return {String}
     * @api public
     */

    this.define('success', function() {
      return this.stylize('green', arguments);
    });

    /**
     * Display a **red** error message and exit with `process.exit(1)`

     * @return {String}
     * @api public
     */

    this.define('fatal', function() {
      var args = [].slice.call(arguments);
      args[0] = (this.red('  ' + this.runner + ' [FAIL]:') + this.gray(' · ') + args[0]);
      console.log();
      console.log.apply(this, args);
      process.exit(1);
    });
  };
};
