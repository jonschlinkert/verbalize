'use strict';

var utils = require('./utils');
var types = ['mode', 'negative'];

function Mode(options) {
  if (!(this instanceof Mode)) {
    return new Mode(options);
  }
  this.options = utils.extend({type: 'mode'}, options);
  if (!this.name) {
    throw new Error('expected options.name to be set');
  }
  this.type = this.options.type;
}

/**
 * Type of `mode`. Valid types are ['mode', 'negative']
 *
 * ```js
 * console.log(verbose.type);
 * //=> "mode"
 * console.log(not.type);
 * //=> "negative"
 * ```
 */

utils.define(Mode.prototype, 'type', {
  enumerable: true,
  set: function(val) {
    val = utils.arrayify(val);
    utils.assertType(types, val);
    this.options.type = val;
  },
  get: function() {
    return this.options.type || 'mode';
  }
});

/**
 * Readable name of `mode`.
 *
 * ```js
 * console.log(verbose.name);
 * //=> "verbose"
 * console.log(not.name);
 * //=> "not"
 * ```
 */

utils.define(Mode.prototype, 'name', {
  enumerable: true,
  set: function(val) {
    this.options.name = val;
  },
  get: function() {
    return this.options.name;
  }
});

Mode.prototype.inspect = function() {
  return this.name;
};

/**
 * Exposes `Mode`
 */

module.exports = Mode;
