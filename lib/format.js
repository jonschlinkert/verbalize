

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
