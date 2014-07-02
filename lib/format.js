

/**
 * Base formatting for special logging.
 *
 * @api private
 * @return {String}
 */

Verbalize.prototype.format = function () {
  return chalk[color]('  ' + this.runner + ' [' + text + ']' + this.sep);
};

/**
 * ## ._addRunner
 *
 * @return {string}
 * @api private
 */

Verbalize.prototype._addRunner = function () {
  var args = _.toArray(arguments);
  args[0] = chalk.green('  ' + this.runner.name + ' [' + args[0] + ']' + this._sep);
  return args;
};


/**
 * Format
 *
 * **Params:**
 *
 * @param  {[type]} color
 * @param  {[type]} text
 * @return {[type]}
 */

// Verbalize.prototype.format = function(color, text) {
//   return this[color]('  ' + this.runner + ' [' + text + '] ' + this.sep);
// };




// Parse certain markup in strings to be logged.
Verbalize.prototype._markup = function (str) {
  str = str || '';
  // Make _foo_ underline.
  str = str.replace(/(\s|^)_(\S|\S[\s\S]+?\S)_(?=[\s,.!?]|$)/g, '$1' + chalk.underline('$2'));
  // Make *foo* bold.
  str = str.replace(/(\s|^)\*(\S|\S[\s\S]+?\S)\*(?=[\s,.!?]|$)/g, '$1' + chalk.bold('$2'));
  return str;
};



Verbalize.prototype.warn = function () {
  var args = _.toArray(arguments);
  var msg = this._format(args);

  if (args.length > 0) {
    this._write(chalk.yellow('>> ') + _str.trim(msg).replace(/\n/g, chalk.yellow('\n>> ')));
  } else {
    this._write(chalk.yellow('WARNING'));
  }
};



/**
 * Base formatting for special logging.
 *
 * @api private
 * @return {String}
 */

Verbalize.prototype.format = function () {
  var args = [].slice.call(arguments);
    console.log(args)
  if (this.runner) {
    var msg = _.rest(args, 1);
    args[1] = this[args[0]]('  [' + this.runner + '] ' + msg);
    if (this._format) {
      args[1] = this[args[0]]('  [' + this.runner + '] ' + msg);
    }
  }
  return console.log.apply(this, args);
};
