
var bold = require('ansi-bold');
var underline = require('ansi-underline');

var boldRegex = /(\x1B\[\d+m|[_\s]|^)([*]{1,2})(\S|\S[\w\W]+?\S)\2(?=[_\s,.!?]|(?:\x1B\[\d+m)|$)/g;
var underlineRegex = /(\x1B\[\d+m|[\s*]|^)(_{1,2})(\S|\S[\w\W]+?\S)\2(?=[*\s,.!?]|(?:\x1B\[\d+m)|$)/g;

/**
 * Expose `utils`
 */

var utils = module.exports;

/**
 * Cast `val` to an array
 *
 * @param  {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Ensure that `val` is a string.
 *
 * @param  {String} `val`
 * @return {String}
 */

utils.toString = function(val) {
  return val == null ? '' : val.toString();
};

/**
 * Display `*foo*` or `**foo**` as bold.
 *
 * @param  {String} `str`
 * @return {String}
 */

utils.toBold = function(str) {
  return utils.toString(str).replace(boldRegex, '$1' + bold('$3'));
};

/**
 * Display `_foo_` as underlined.
 *
 * @param  {String} `str`
 * @return {String}
 */

utils.toUnderline = function(str) {
  return utils.toString(str).replace(underlineRegex, '$1' + underline('$3'));
};

utils.markup = function(str) {
  str = utils.toString(str);
  return utils.toBold(utils.toUnderline(str));

  // str = str.replace(/(\s|^)_(\S|\S[\s\S]+?\S)_(?=[\s,.!?]|$)/g, '$1' + chalk.underline('$2'));
  // str = str.replace(/(\s|^)\*(\S|\S[\s\S]+?\S)\*(?=[\s,.!?]|$)/g, '$1' + chalk.bold('$2'));
  // return str;
};
