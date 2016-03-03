'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line no-native-reassign

/**
 * Lazily required module dependencies
 */

require('base-is-enabled', 'isEnabled');
require('./colors', 'colors');
require('./handler', 'handler');
require('./rainbow', 'rainbow');
require('./styles', 'styles');

require = fn; // eslint-disable-line no-native-reassign

/**
 * Expose `utils` modules
 */

module.exports = utils;
