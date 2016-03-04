'use strict';

module.exports = function(options) {
  return function() {
    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.style('log', {type: 'logger'}, function() {
      return this.stylize('white', arguments);
    });

    /**
     * **bold** message.
     *
     * @return {String}
     * @api public
     */

    this.style('subhead', {type: 'logger'}, function() {
      return this.stylize('bold', arguments);
    });

    /**
     * Get the current time using `.toLocaleTimeString()`.
     *
     * @return {String}
     */

    this.style('time', {type: 'logger'}, function() {
      var time = new Date().toLocaleTimeString();
      return this.stylize('bgBlack', this.stylize('white', time)) + ' ';
    });

    /**
     * Display a **gray** timestamp.
     *
     * @return {String}
     * @api public
     */

    this.style('timestamp', {type: 'logger'}, function() {
      var args = [].slice.call(arguments);
      args[0] = this.stylize('time', '') +
                this.stylize('gray', args[0]);
      return args;
    });

    /**
     * Display a **gray** informational message.
     *
     * @return {String}
     * @api public
     */

    this.style('inform', {type: 'logger'}, function() {
      return this.stylize('gray', arguments);
    });

    /**
     * Display a **cyan** informational message.
     *
     * @return {String}
     * @api public
     */

    this.style('info', {type: 'logger'}, function() {
      return this.stylize('cyan', arguments);
    });

    /**
     * Display a **yellow** warning message.
     *
     * @return {String}
     * @api public
     */

    this.style('warn', {type: 'logger'}, function() {
      return this.stylize('yellow', arguments);
    });

    /**
     * Display a **red** error message.
     *
     * @return {String}
     * @api public
     */

    this.style('error', {type: 'logger'}, function() {
      return this.stylize('red', arguments);
    });

    /**
     * Display a **green** success message.
     *
     * @return {String}
     * @api public
     */

    this.style('success', {type: 'logger'}, function() {
      return this.stylize('green', arguments);
    });

    /**
     * Display a **red** error message and exit with `process.exit(1)`

     * @return {String}
     * @api public
     */

    this.style('fail', {type: 'logger'}, function() {
      var args = [].slice.call(arguments);
      args[0] = (this.red('  ' + this.runner + ' [FAIL]:') + this.gray(' · ') + args[0]);
      console.log();
      console.log.apply(this, args);
      process.exit(1);
    });
  };
};
