'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('base-is-enabled', 'isEnabled');
require('./base-logger', 'logger');
require('./colors', 'colors');
require('./handler', 'handler');
require('./rainbow', 'rainbow');
require('./styles', 'styles');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
