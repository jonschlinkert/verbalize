'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('define-property', 'define');
require('extend-shallow', 'extend');
require('get-value', 'get');
require('set-value', 'set');
require('use');
require = fn;

/**
 * Cast `val` to an array
 *
 * @param  {String|Array} `val`
 * @return {Array}
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isLast = function(arr, val) {
  return arr &&
    arr.length &&
    arr[arr.length - 1] === val;
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
